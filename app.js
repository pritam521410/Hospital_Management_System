if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
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

// Models import kar rahe hain
const User = require("./models/user");

// Routes import kar rahe hain
const listingRoutes = require("./routes/listingRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const userRoutes = require("./routes/userRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const myBookingRoutes = require("./routes/myBookingRoutes");
const paymentAPIRoute = require("./routes/paymentRoute");
const paymentRoutes = require("./routes/paymentRoutes");
const pageRoutes = require("./routes/pageRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const policyRoutes = require("./routes/policyRoutes");
const newsletterRoutes = require("./routes/newsletterRoutes");

// Controllers import for direct routes
const listingController = require("./controllers/listingController");
const wrapAsync = require("./utils/wrapAsync");

// MongoDB se connect ho rahe hain
const dbUrl =
  process.env.ATLASDB_URL ||
  "mongodb://127.0.0.1:27017/HospitalManagementSystem";

// Check for required environment variables
if (!process.env.ATLASDB_URL) {
  console.warn("⚠️  WARNING: ATLASDB_URL not found in environment variables!");
  console.warn(
    "⚠️  Using local MongoDB. Please set environment variables in production."
  );
}

if (!process.env.SECRET) {
  console.warn("⚠️  WARNING: SECRET not found in environment variables!");
  console.warn(
    "⚠️  Using default secret. Please set SECRET in production for security."
  );
}

async function main() {
  await mongoose.connect(dbUrl);
  console.log(
    "✅ Connected to DB:",
    dbUrl.includes("mongodb://127") ? "Local MongoDB" : "MongoDB Atlas"
  );
}
main().catch((err) => {
  console.error("❌ DB connection error:", err.message);
  console.error(
    "Please check your MongoDB connection string and ensure MongoDB is running."
  );
});

// EJS view engine aur views folder set kar rahe hain
app.engine("ejs", ejsMate); // EJS-Mate template engine use kar rahe hain
app.set("view engine", "ejs"); // View engine set kiya hai
app.set("views", path.join(__dirname, "views")); // Views folder ko path ke roop mein set kiya hai

// Middleware: body parser, method override, aur static files ke liye
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Form data ko process karte hain
app.use(methodOverride("_method")); // HTTP methods ko override karte hain (PUT/DELETE)
app.use(express.static(path.join(__dirname, "/public"))); // Static files ko serve karte hain

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET || "thisisasecretkey-pleasechangeinproduction",
  },
  touchAfter: 24 * 3600,
});

store.on("error", (err) => {
  console.log("ERROR in MONGO SESSION STORE", err);
});

// Session setup with cookie
const sessionOptions = {
  store: store, // MongoDB store use kar rahe hain sessions ke liye
  secret: process.env.SECRET || "thisisasecretkey-pleasechangeinproduction", // Session ko secure banane ke liye secret
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 din baad expire hoga
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 din tak cookie valid rahegi
    httpOnly: true, // Client-side JS se cookie ko access karna nahi hoga
  },
};

app.use(session(sessionOptions)); // Session middleware ko apply kar rahe hain
app.use(flash()); // Flash messages ke liye middleware use ho raha hai

// Passport (authentication) initialize aur configure kar rahe hain
app.use(passport.initialize()); // Passport ko initialize kar rahe hain
app.use(passport.session()); // Session ke liye passport ko use kar rahe hain
passport.use(new LocalStrategy(User.authenticate())); // Local strategy use kar rahe hain authentication ke liye
passport.serializeUser(User.serializeUser()); // User ko serialize kar rahe hain
passport.deserializeUser(User.deserializeUser()); // User ko deserialize kar rahe hain

// Har view me flash message aur currentUser access ke liye middleware
app.use((req, res, next) => {
  res.locals.success = req.flash("success"); // Success message ko view me pass karte hain
  res.locals.error = req.flash("error"); // Error message ko view me pass karte hain
  res.locals.currentUser = req.user; // Current user ko view me pass karte hain
  next();
});

// Routes use kar rahe hain
app.use("/", pageRoutes); // Page routes (home, about, contact)
app.use("/", userRoutes); // User routes (signup, login, logout, profile)
app.use("/", paymentRoutes); // Payment routes (buy, cart, create-order, dummy-order)
app.use("/", policyRoutes); // Policy routes (privacy, terms, cookies)
app.use("/services", serviceRoutes); // Service routes (emergency, diagnostics, etc.)
app.use("/newsletter", newsletterRoutes); // Newsletter subscription route
app.use("/listings", listingRoutes); // Listing routes
app.use("/listings/:id/reviews", reviewRoutes); // Review routes
app.use("/bookings", bookingRoutes); // Booking routes
app.use("/my-bookings", myBookingRoutes); // My bookings route
app.use("/api/payment", paymentAPIRoute); // Payment API route

// Direct /rooms route
app.get("/rooms", wrapAsync(listingController.rooms));

// Server ko start kar rahe hain
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || "development"}`);
});
