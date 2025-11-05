const Razorpay = require("razorpay");
const Listing = require("../models/listing");
const mongoose = require("mongoose");

// Buy Page dikhana
module.exports.renderBuyPage = (req, res) => {
  res.render("buy");
};

// Cart Page dikhana
module.exports.renderCartPage = (req, res) => {
  res.render("cart");
};

// Buy Item by ID
module.exports.buyItem = async (req, res) => {
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
    res.render("buy", { item });
  } catch (err) {
    console.error(err);
    res.status(500).send("Developers are working on it.");
  }
};

// Create Razorpay Order
module.exports.createOrder = (req, res) => {
  var instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET,
  });

  var options = {
    amount: req.body.amount * 100,
    currency: "INR",
    receipt: "CUST_ORDER_ID" + Date.now(),
  };
  
  instance.orders.create(options, function (err, order) {
    res.json({
      orderId: order.id,
      amount: options.amount,
      rzrpay_key: process.env.RAZORPAY_KEY_ID,
    });
  });
};

// Dummy Order Page dikhana
module.exports.renderDummyOrder = (req, res) => {
  res.render("pay-noww");
};

