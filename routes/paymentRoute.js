const express = require("express");
const razorpay = require("../utils/razorpay");
const Payment = require("../models/payment");

const router = express.Router();

router.post("/create-order", async (req, res) => {
  const { amount } = req.body; 
 
  const options = {
    amount: amount * 100, 
    currency: "INR",
    receipt: `rcpt_${Math.floor(Math.random() * 1000000)}`
  };

  try {
    
    const order = await razorpay.orders.create(options);

    
    const payment = new Payment({
      razorpay_order_id: order.id,
      amount: amount, 
      currency: order.currency,
      status: order.status
    });

    await payment.save();

    
    res.status(201).json({
      id: order.id,
      currency: order.currency,
      amount: amount, 
      status: order.status
    });

  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
});

module.exports = router;
