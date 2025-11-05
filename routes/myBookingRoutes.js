const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn } = require("../middleware.js");
const bookingController = require("../controllers/bookingController.js");

// My Bookings Route
router.get("/", isLoggedIn, wrapAsync(bookingController.myBookings));

module.exports = router;

