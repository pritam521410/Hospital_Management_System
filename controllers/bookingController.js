const Booking = require("../models/booking");
const Listing = require("../models/listing");

// Redirect to My Bookings
module.exports.index = (req, res) => {
  res.redirect("/my-bookings");
};

// New Booking Form dikhana
module.exports.renderNewForm = async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  const roomType = req.query.roomType;
  const price = req.query.price;

  if (!listing) {
    req.flash("error", "Hospital not found!");
    return res.redirect("/listings");
  }

  res.render("bookings/new", { listing, roomType, price });
};

// Create Booking
module.exports.createBooking = async (req, res) => {
  const newBooking = new Booking(req.body.booking);
  newBooking.user = req.user._id;

  // Calculate number of days and total amount
  const checkIn = new Date(newBooking.checkInDate);
  const checkOut = new Date(newBooking.checkOutDate);
  const diffTime = Math.abs(checkOut - checkIn);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  newBooking.numberOfDays = diffDays || 1;
  newBooking.totalAmount = newBooking.numberOfDays * newBooking.pricePerDay;

  await newBooking.save();

  // Redirect to payment page
  res.redirect(`/bookings/${newBooking._id}/payment`);
};

// Payment Page dikhana
module.exports.renderPaymentPage = async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate("hospital")
    .populate("user");

  if (!booking) {
    req.flash("error", "Booking not found!");
    return res.redirect("/listings");
  }

  // Check if user is the one who made the booking
  if (!booking.user._id.equals(req.user._id)) {
    req.flash("error", "You don't have permission to view this booking!");
    return res.redirect("/listings");
  }

  res.render("bookings/payment", { booking });
};

// Payment Success
module.exports.paymentSuccess = async (req, res) => {
  const { paymentId, orderId } = req.body;
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return res
      .status(404)
      .json({ success: false, message: "Booking not found!" });
  }

  booking.paymentStatus = "Completed";
  booking.paymentId = paymentId;
  booking.orderId = orderId;
  await booking.save();

  res.json({ success: true, message: "Payment successful!" });
};

// Booking Confirmation dikhana
module.exports.renderConfirmation = async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate("hospital")
    .populate("user");

  if (!booking) {
    req.flash("error", "Booking not found!");
    return res.redirect("/listings");
  }

  if (!booking.user._id.equals(req.user._id)) {
    req.flash("error", "You don't have permission to view this booking!");
    return res.redirect("/listings");
  }

  res.render("bookings/confirmation", { booking });
};

// My Bookings dikhana
module.exports.myBookings = async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate("hospital")
    .sort({ createdAt: -1 });

  res.render("bookings/myBookings", { bookings });
};

