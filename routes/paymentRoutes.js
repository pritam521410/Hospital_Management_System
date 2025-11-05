const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const paymentController = require("../controllers/paymentController.js");

// Buy Route
router.get("/buy", wrapAsync(paymentController.renderBuyPage));

// Cart Route
router.get("/cart", paymentController.renderCartPage);

// Buy Item by ID
router.get("/buy/:id", paymentController.buyItem);

// Create Razorpay Order
router.post("/create-order", paymentController.createOrder);

// Dummy Order Route
router.get("/dummy-order", paymentController.renderDummyOrder);

module.exports = router;

