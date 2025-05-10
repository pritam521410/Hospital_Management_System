const Listing = require("./models/listing");
const Review = require("./models/review");
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

  // Find the listing by ID
  let  listing = await Listing.findById(id);

  // Check if the current logged-in user is the owner of the listing
  if (!listing.owner.equals(res.locals.currentUser._id)) {
    req.flash("error", "You don't have permission to edit this listing.");
    return res.redirect(`/listings/${id}`);
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
