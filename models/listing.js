const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

// Schema for individual room types
const roomTypeSchema = new Schema(
  {
    type: { type: String, required: true },
    pricePerDay: { type: Number, required: true },
    isAvailable: { type: Boolean, required: true },
    facilities: { type: [String], required: true },
    bedCount: { type: Number, required: true },
  },
  { _id: false } // Avoids creating extra _id for each roomType
);

// Main Listing schema
const listingSchema = new Schema({
  name: {
    type: String,
  },
  description: {
    type: String,
  },
  image: {
   url: String,
   filename: String,
  },
  location: {
    type: String,
  },
  city: {
    type: String,
  },
  state: {
    type: String,
  },
  country: {
    type: String,
  },
  contactNumber: {
    type: String,
  },
  email: {
    type: String,
  },
  roomTypes: [roomTypeSchema],
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

// Middleware: When a listing is deleted, delete all related reviews
listingSchema.post("findOneAndDelete", async function (listing) {
  if (listing) {
    await Review.deleteMany({
      _id: { $in: listing.reviews },
    });
  }
});

// Export the model
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
