const express = require("express");
const router = express.Router();
const serviceController = require("../controllers/serviceController.js");

// Service Routes
router.get("/emergency", serviceController.emergency);
router.get("/diagnostics", serviceController.diagnostics);
router.get("/pharmacy", serviceController.pharmacy);
router.get("/consultation", serviceController.consultation);
router.get("/lab", serviceController.lab);
router.get("/surgery", serviceController.surgery);

module.exports = router;

