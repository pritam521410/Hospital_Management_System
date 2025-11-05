const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const medicineSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  manufacturer: {
    type: String,
    required: true,
  },
  uses: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  image: {
    url: String,
    filename: String,
  },
  category: {
    type: String,
    enum: ['Pain Relief', 'Antibiotics', 'Cold & Cough', 'Vitamins', 'General', 'Other'],
    default: 'General',
  },
  prescriptionRequired: {
    type: Boolean,
    default: false,
  },
  stockQuantity: {
    type: Number,
    default: 100,
    min: 0,
  },
  dosage: {
    type: String, // e.g., "500mg", "10ml"
  },
  packSize: {
    type: String, // e.g., "Strip of 10 tablets", "Bottle of 100ml"
  },
  expiryDate: {
    type: Date,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt
});

module.exports = mongoose.model("Medicine", medicineSchema);

