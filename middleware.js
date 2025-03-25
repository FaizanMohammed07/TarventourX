const listing = require("./models/listing.js");
const expressErr = require("./utils/expressErr.js");
const { listingSchema } = require("./schemaEr.js");
const { reviewSchema } = require("./schemaEr.js");
const Review = require("./models/review.js");

module.exports.IsLoggedIn = (req, res, next) => {
  //   console.log(req.path, "..", req.originalUrl);
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be login");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let Listings = await listing.findById(id);
  if (!Listings.owner.equals(res.locals.CrrUser._id)) {
    req.flash("error", "You are not Owner");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports.validateSchema = async (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let msgErr = error.details.map((el) => el.message).join(",");
    throw new expressErr(400, msgErr);
  } else {
    next();
  }
};

module.exports.validateReview = async (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let msgErr = error.details.map((el) => el.message).join(",");
    throw new expressErr(400, msgErr);
  } else {
    next();
  }
};

module.exports.isReviewAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let reviews = await Review.findById(reviewId);
  if (!reviews.author.equals(res.locals.CrrUser._id)) {
    req.flash("error", "You are not Owner of the Review");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
