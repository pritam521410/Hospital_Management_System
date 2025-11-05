const Listing = require("./models/listing");
const Review = require("./models/review");
const Medicine = require("./models/medicine");
module.exports.isLoggedIn=(req , res , next)=>{
    if (!req.isAuthenticated()) {
        // url  save to usi page ka access jaha user tha pahale
        req.session.redirectUrl=req.originalUrl;

        req.flash("error", "Please log in to HospitalCare to add a room to your hospital.");
        return res.redirect("/login");  // ✅ return lagao yahan
      }
      next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
      res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
  };
  


module.exports.isOwner= async (req, res, next)=>{
  let  { id } = req.params;

  // Check if it's a medicine or listing based on the route
  let resource;
  if (req.originalUrl.includes('/medicines')) {
    resource = await Medicine.findById(id);
    if (!resource.owner.equals(res.locals.currentUser._id)) {
      req.flash("error", "You don't have permission to edit this medicine.");
      return res.redirect(`/medicines/${id}`);
    }
  } else {
    resource = await Listing.findById(id);
    if (!resource.owner.equals(res.locals.currentUser._id)) {
      req.flash("error", "You don't have permission to edit this listing.");
      return res.redirect(`/listings/${id}`);
    }
  }
  next();
};

module.exports.isReviewAuthor= async (req, res, next)=>{
  let  { reviewId , id } = req.params;

  // Find the listing by ID
  let  review = await Review .findById(reviewId);

  // Check if the current logged-in user is the owner of the listing
  if (!review.author.equals(res.locals.currentUser._id)) {
    req.flash("error", "You can't Delete this Review you are not author for this Review");
    return res.redirect(`/listings/${id}`);
  }
  next();
}
