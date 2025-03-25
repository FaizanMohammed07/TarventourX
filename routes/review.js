const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {
  validateReview,
  IsLoggedIn,
  isReviewAuthor,
} = require("../middleware.js");

const reviewController = require("../controllers/reviews.js");

// Post Review Route new review
router.post(
  "/",
  IsLoggedIn,
  validateReview,
  wrapAsync(reviewController.newReview)
);

//delete Review route
router.delete(
  "/:reviewId",
  IsLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.destroyReview)
);

module.exports = router;
