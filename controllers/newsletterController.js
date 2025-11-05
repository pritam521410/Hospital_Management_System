const Newsletter = require("../models/newsletter");

// Subscribe to Newsletter
module.exports.subscribe = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if email already exists
    const existingSubscriber = await Newsletter.findOne({ email });
    
    if (existingSubscriber) {
      return res.json({
        success: false,
        message: "This email is already subscribed!",
      });
    }

    // Create new subscriber
    const newSubscriber = new Newsletter({ email });
    await newSubscriber.save();

    res.json({
      success: true,
      message: `Thank you for subscribing! We'll send updates to ${email}`,
    });
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    res.json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

