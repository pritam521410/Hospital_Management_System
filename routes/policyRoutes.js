const express = require("express");
const router = express.Router();
const policyController = require("../controllers/policyController.js");

// Policy Routes
router.get("/privacy", policyController.privacy);
router.get("/terms", policyController.terms);
router.get("/cookies", policyController.cookies);

module.exports = router;

