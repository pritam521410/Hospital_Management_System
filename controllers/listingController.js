const Listing = require("../models/listing");

// Index Route - Sabhi listings ko fetch karna
module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index", { allListings });
};

// Rooms Route - Sabhi available rooms ko hospital info ke saath fetch karna
module.exports.rooms = async (req, res) => {
  // Fetch all listings with their roomTypes
  const allListings = await Listing.find({}).populate("owner");

  // Extract all rooms with hospital information
  const allRooms = [];
  allListings.forEach((listing) => {
    if (listing.roomTypes && listing.roomTypes.length > 0) {
      listing.roomTypes.forEach((room) => {
        allRooms.push({
          roomType: room.type,
          pricePerDay: room.pricePerDay,
          isAvailable: room.isAvailable,
          facilities: room.facilities,
          bedCount: room.bedCount,
          hospitalName: listing.name,
          hospitalLocation: listing.location,
          hospitalCity: listing.city,
          hospitalImage: listing.image,
          hospitalContact: listing.contactNumber,
          hospitalId: listing._id,
        });
      });
    }
  });

  res.render("rooms", { allRooms });
};

// New Listing Form dikhana
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new");
};

// Naya Listing Create karna
module.exports.createListing = async (req, res) => {
  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  await newListing.save();
  req.flash("success", "Successfully Room Added");
  res.redirect("/listings");
};

// Show Route - Specific listing ko dikhana
module.exports.showListing = async (req, res) => {
  const listing = await Listing.findById(req.params.id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Room does not exist");
    return res.redirect("/listings");
  }

  res.render("listings/show", { listing });
};

// Edit Form dikhana
module.exports.renderEditForm = async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }
  res.render("listings/edit", { listing });
};

// Listing Update karna
module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }

  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

// Listing Delete karna
module.exports.deleteListing = async (req, res) => {
  await Listing.findByIdAndDelete(req.params.id);
  req.flash("success", "Room Deleted!");
  res.redirect("/listings");
};

