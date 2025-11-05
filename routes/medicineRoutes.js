const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner } = require("../middleware.js");
const medicineController = require("../controllers/medicineController.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");

const upload = multer({ storage });

// Index Route - Sabhi medicines dikhana
router.get("/", wrapAsync(medicineController.index));

// New Medicine Form
router.get("/new", isLoggedIn, medicineController.renderNewForm);

// Create Medicine
router.post(
  "/",
  isLoggedIn,
  upload.single("medicine[image]"),
  wrapAsync(medicineController.createMedicine)
);

// Show Medicine
router.get("/:id", wrapAsync(medicineController.showMedicine));

// Edit Medicine Form
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(medicineController.renderEditForm)
);

// Update Medicine
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  upload.single("medicine[image]"),
  wrapAsync(medicineController.updateMedicine)
);

// Delete Medicine
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(medicineController.deleteMedicine)
);

module.exports = router;

