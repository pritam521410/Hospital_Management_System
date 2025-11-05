const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn } = require("../middleware.js");
const bookingController = require("../controllers/bookingController.js");

// Bookings Index - Redirect to My Bookings
router.get("/", isLoggedIn, bookingController.index);

// New Booking Form
router.get("/new/:id", isLoggedIn, wrapAsync(bookingController.renderNewForm));

// Create Booking
router.post("/", isLoggedIn, wrapAsync(bookingController.createBooking));

// Payment Page
router.get(
  "/:id/payment",
  isLoggedIn,
  wrapAsync(bookingController.renderPaymentPage)
);

// Payment Success
router.post(
  "/:id/payment-success",
  isLoggedIn,
  wrapAsync(bookingController.paymentSuccess)
);

// Booking Confirmation
router.get(
  "/:id/confirmation",
  isLoggedIn,
  wrapAsync(bookingController.renderConfirmation)
);

module.exports = router;

