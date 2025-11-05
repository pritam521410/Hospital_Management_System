const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const newsletterController = require("../controllers/newsletterController.js");

// Newsletter Subscription Route
router.post("/subscribe", wrapAsync(newsletterController.subscribe));

module.exports = router;
