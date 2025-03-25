const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Listing = require("../models/listing");
const { IsLoggedIn } = require("../middleware");

//  Add to Wishlist
router.post("/:id/add", IsLoggedIn, async (req, res) => {
  const user = await User.findById(req.user._id);
  const listingId = req.params.id;

  if (!user.wishlist.includes(listingId)) {
    user.wishlist.push(listingId);
    await user.save();
  }

  res.redirect("next");
});

//  Remove from Wishlist
router.post("/:id/remove", IsLoggedIn, async (req, res) => {
  const user = await User.findById(req.user._id);
  user.wishlist = user.wishlist.filter((id) => id.toString() !== req.params.id);
  await user.save();

  res.redirect("next");
});

//show route
router.get("/list", IsLoggedIn, async (req, res) => {
  const user = await User.findById(req.user._id).populate("wishlist");
  res.render("wishlist.ejs", { wishlist: user.wishlist });
});

module.exports = router;
