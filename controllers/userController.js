const User = require("../models/user");

// Signup Form dikhana
module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup");
};

// Signup - Naya user register karna
module.exports.signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to HospitalCare");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

// Login Form dikhana
module.exports.renderLoginForm = (req, res) => {
  res.render("users/login");
};

// Login - User ko login karna
module.exports.login = (req, res) => {
  req.flash("success", "Welcome to HospitalCare!");
  const redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

// Logout - User ko logout karna
module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash("success", "You are logged out!");
    res.redirect("/listings");
  });
};

// Profile Page dikhana
module.exports.renderProfile = async (req, res) => {
  const Booking = require("../models/booking");
  const Listing = require("../models/listing");
  
  const userId = req.user._id;

  // Get user's bookings
  const bookings = await Booking.find({ user: userId });

  // Get user's listings
  const listings = await Listing.find({ owner: userId });

  // Calculate statistics
  const totalBookings = bookings.length;
  const totalSpent = bookings.reduce(
    (sum, booking) => sum + booking.totalAmount,
    0
  );
  const totalListings = listings.length;

  // Get recent bookings
  const recentBookings = await Booking.find({ user: userId })
    .populate("hospital")
    .sort({ createdAt: -1 })
    .limit(3);

  res.render("users/profile", {
    user: req.user,
    totalBookings,
    totalSpent,
    totalListings,
    recentBookings,
  });
};

