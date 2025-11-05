const express = require("express");
const router = express.Router();
const pageController = require("../controllers/pageController.js");

// Root Route - Redirect to listings
router.get("/", pageController.home);

// About Page
router.get("/about", pageController.about);

// Contact Page
router.get("/contact", pageController.contact);

module.exports = router;

