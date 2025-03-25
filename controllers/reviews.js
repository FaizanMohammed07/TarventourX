const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

module.exports.newReview = async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
  console.log(newReview);
  newReview.author = req.user._id;
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  req.flash("success", "Review was added !");
  return res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyReview = async (req, res) => {
  let { id, reviewId } = req.params;
  await Review.findByIdAndDelete(reviewId);
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  // console.log(delrev);
  req.flash("success", "Review was deleted !");
  res.redirect(`/listings/${id}`);
};
