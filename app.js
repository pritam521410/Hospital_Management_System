if(process.env.NODE_ENV !="production"){
  require('dotenv').config()
}
 

// Zaroori packages aur models import kar rahe hain
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const multer  = require('multer');
const {storage}  = require('./cloudConfig.js');

const upload = multer({ storage });


// Models import kar rahe hain
const Listing = require("./models/listing");
const Review = require("./models/review");
const User = require("./models/user");

// Utility files import
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");

// Middleware functions import
const { isLoggedIn, saveRedirectUrl, isOwner , isReviewAuthor} = require("./middleware.js");

// MongoDB se connect ho rahe hain
// const MONGO_URL = "mongodb://127.0.0.1:27017/HospitalManagementSystem";

const dbUrl=process.env.ATLASDB_URL
async function main() {
  await mongoose.connect(dbUrl);
  console.log("Connected to DB");
}
main().catch((err) => console.log("DB connection error:", err));

// EJS view engine aur views folder set kar rahe hain
app.engine("ejs", ejsMate);  // EJS-Mate template engine use kar rahe hain
app.set("view engine", "ejs"); // View engine set kiya hai
app.set("views", path.join(__dirname, "views")); // Views folder ko path ke roop mein set kiya hai

// Middleware: body parser, method override, aur static files ke liye
app.use(express.urlencoded({ extended: true })); // Form data ko process karte hain
app.use(methodOverride("_method")); // HTTP methods ko override karte hain (PUT/DELETE)
app.use(express.static(path.join(__dirname, "/public"))); // Static files ko serve karte hain


const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error" ,()=>{
  console.log("ERROR in MONGO SESSION STORE",err);
});


// Session setup with cookie
const sessionOptions = {
  secret: "process.env.SECRET",  // Session ko secure banane ke liye secret
  resave: false, 
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 din baad expire hoga
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 din tak cookie valid rahegi
    httpOnly: true, // Client-side JS se cookie ko access karna nahi hoga
  },
};


app.use(session(sessionOptions)); // Session middleware ko apply kar rahe hain
app.use(flash());  // Flash messages ke liye middleware use ho raha hai

// Passport (authentication) initialize aur configure kar rahe hain
app.use(passport.initialize());  // Passport ko initialize kar rahe hain
app.use(passport.session());  // Session ke liye passport ko use kar rahe hain
passport.use(new LocalStrategy(User.authenticate()));  // Local strategy use kar rahe hain authentication ke liye
passport.serializeUser(User.serializeUser());  // User ko serialize kar rahe hain
passport.deserializeUser(User.deserializeUser());  // User ko deserialize kar rahe hain

// Har view me flash message aur currentUser access ke liye middleware
app.use((req, res, next) => {
  res.locals.success = req.flash("success");  // Success message ko view me pass karte hain
  res.locals.error = req.flash("error");  // Error message ko view me pass karte hain
  res.locals.currentUser = req.user;  // Current user ko view me pass karte hain
  next();
});

// // Root route ko 
// app.get("/", (req, res) => {
//   res.redirect("/listings");  // Root page pe /listings ko redirect karte hain
// });

// Review validation middleware - agar review galat hai to error throw hoga
const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);  // Review ko validate karte hain
  if (error) {
    const errorMsg = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(400, errorMsg);  // Agar error ho toh custom error throw karte hain
  }
  next();
};

//about 
app.get("/about", (req, res) => res.render("about"));  // About page
// contact
app.get("/contact", (req, res) => res.render("contact"));  // Contact page

// Index Route
app.get("/listings", wrapAsync(async (req, res) => {
  const allListings = await Listing.find({});  // Sabhi listings ko fetch kar rahe hain
  res.render("listings/index", { allListings });  // Listings ko render kar rahe hain
}));

// New Listing Route - sirf logged in users ke liye
app.get("/listings/new", isLoggedIn, (req, res) => res.render("listings/new"));  // New listing form

// Create Listing Route
app.post("/listings", isLoggedIn, upload.single('listing[image]'),wrapAsync(async (req, res) => {
  let url=req.file.path;
  let filename= req.file.filename;
  const newListing = new Listing(req.body.listing);  // Nayi listing ko create kar rahe hain
  newListing.owner = req.user._id;  // Current user ko owner bana rahe hain
  newListing.image={url, filename};
  await newListing.save();  // Nayi listing ko save kar rahe hain
  req.flash("success", "Successfully Room Added");  // Flash message bhej rahe hain
  res.redirect("/listings");  // Listings page pe redirect kar rahe hain
}));


// Show Route
app.get("/listings/:id", wrapAsync(async (req, res) => {
  const listing = await Listing.findById(req.params.id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");  // Listing fetch kar rahe hain
  
  if (!listing) {
    req.flash("error", "Room does not exist");  // Agar listing nahi milti toh error message
    return res.redirect("/listings");  // Listings page pe redirect kar rahe hain
  }

  res.render("listings/show", { listing });  // Listing ko show kar rahe hain
}));


// Edit Route
app.get("/listings/:id/edit", isLoggedIn,isOwner, wrapAsync(async (req, res) => {
  const listing = await Listing.findById(req.params.id);  // Listing ko fetch kar rahe hain
  if (!listing) {
    throw new ExpressError(404, "Listing not found");  // Agar listing nahi milti toh error throw karte hain
  }
  res.render("listings/edit", { listing });  // Edit form render kar rahe hain
}));


// Update Route
app.put("/listings/:id", isLoggedIn, isOwner, upload.single('listing[image]'),wrapAsync(async (req, res) => {
  // Request ke params se 'id' nikal rahe hain (jaise URL mein diya hota hai /listing/:id)
  let { id } = req.params;

  // Database mein Listing collection se id ke basis pe listing ko dhoond kar usme nayi values update kar rahe hain (req.body.listing se)
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  // Agar request ke andar koi naya file upload hua hai to (req.file exist karta hai)
  if (typeof req.file !== "undefined") {
      // File ka path nikal rahe hain (jisme image store hui hai)
      let url = req.file.path;
      
      // File ka sirf filename nikal rahe hain (sirf naam, path ke bina)
      let filename = req.file.filename;
      
      // Listing ke andar image field ko update kar rahe hain naye url aur filename ke saath
      listing.image = { url, filename };
      
      // Listing ko database mein save kar rahe hain taaki naye image ka data bhi store ho jaye
      await listing.save();
  }

  // User ko success message dikhane ke liye flash message set kar rahe hain
  req.flash("success", "Listing Updated!");

  // Update hone ke baad user ko wapas usi listing page par redirect kar rahe hain
  res.redirect(`/listings/${id}`);

}));

// Delete Listing
app.delete("/listings/:id", isLoggedIn,isOwner,wrapAsync(async (req, res) => {
  await Listing.findByIdAndDelete(req.params.id);  // Listing ko delete kar rahe hain
  req.flash("success", "Room Deleted!");  // Flash message bhej rahe hain
  res.redirect("/listings");  // Listings page pe redirect kar rahe hain
}));

// Create Review
app.post("/listings/:id/reviews", isLoggedIn,validateReview, wrapAsync(async (req, res) => {
  let listing = await Listing.findById(req.params.id);  // Listing fetch kar rahe hain
  let  newReview = new Review(req.body.review);
    // Naya review create kar rahe hain
    newReview.author=req.user._id;
    console.log(newReview);
  listing.reviews.push(newReview);  // Review ko listing ke saath associate kar rahe hain
  await newReview.save();  // Naya review save kar rahe hain
  await listing.save();  // Listing ko save kar rahe hain
  req.flash("success", "Thanks for your review!");  // Flash message bhej rahe hain
  res.redirect(`/listings/${listing._id}`);  // Listing page pe redirect kar rahe hain
}));

// Delete Review Route
app.delete("/listings/:id/reviews/:reviewId",isLoggedIn, isReviewAuthor, wrapAsync(async (req, res) => {
  const { id, reviewId } = req.params;  // Listing aur review ID ko destructure kar rahe hain
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });  // Review ko listing se remove kar rahe hain
  await Review.findByIdAndDelete(reviewId);  // Review ko delete kar rahe hain
  req.flash("success", "Review deleted");  // Flash message bhej rahe hain
  res.redirect(`/listings/${id}`);  // Listing page pe redirect kar rahe hain
}));

// Signup form dikhane wala route
app.get("/signup", (req, res) => res.render("users/signup"));  // Signup page

// Signup karne ka POST route
app.post("/signup", wrapAsync(async (req, res, next) => {
  try {
    const { username, email, password } = req.body;  // User data ko destructure kar rahe hain
    const newUser = new User({ email, username });  // New user create kar rahe hain
    const registeredUser = await User.register(newUser, password);  // User ko register kar rahe hain
    req.login(registeredUser, (err) => {  // User ko login kar rahe hain
      if (err) return next(err);
      req.flash("success", "Welcome to HospitalCare");
      res.redirect("/listings");  // Listings page pe redirect kar rahe hain
    });
  } catch (e) {
    req.flash("error", e.message);  // Error ko flash kar rahe hain
    res.redirect("/signup");  // Signup page pe redirect kar rahe hain
  }
}));

// Login form dikhane wala route
app.get("/login", (req, res) => res.render("users/login"));  // Login page

// Login karne ka POST route
app.post("/login", saveRedirectUrl, passport.authenticate("local", {
  failureRedirect: "/login",
  failureFlash: true,
}), (req, res) => {
  req.flash("success", "Welcome to HospitalCare!");  // Success message bhej rahe hain
  const redirectUrl = res.locals.redirectUrl || "/listings";  // Redirect URL set kar rahe hain
  res.redirect(redirectUrl);  // Redirect kar rahe hain
});

// Logout ka route
app.get("/logout", (req, res, next) => {
  req.logout((err) => {  // User logout kar rahe hain
    if (err) return next(err);
    req.flash("success", "You are logged out!");  // Logout hone par success message
    res.redirect("/listings");  // Listings page pe redirect kar rahe hain
  });
});


// Route for /buy
app.get('/buy', (req, res) => {
  res.render('buy'); // This will render views/buy.ejs
});

app.get('/buy/:id', async (req, res) => {
  const { id } = req.params;

  // Check if the ID is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send("Developers are working on it.");
  }

  try {
    const item = await Listing.findById(id);
    if (!item) {
      return res.status(404).send("Medicine not found.");
    }
    res.render('buy', { item });
  } catch (err) {
    console.error(err);
    res.status(500).send("Developers are working on it.");
  }
});



// Server ko start kar rahe hain port 8080 pe
app.listen(8080, () => {
  console.log("App is listening on port 8080");  // Server start hone par console message
});
