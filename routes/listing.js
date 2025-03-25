const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const listing = require("../models/listing.js");
const { IsLoggedIn, isOwner, validateSchema } = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router
  .route("/")
  .get(listingController.index)
  .post(
    IsLoggedIn,
    upload.single("listing[image]"),
    validateSchema,
    wrapAsync(listingController.createListing)
  );

//new route
router.get("/new", IsLoggedIn, listingController.newRoute);

router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    IsLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateSchema,
    wrapAsync(listingController.updateListing)
  )
  .delete(IsLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

//edit route
router.get(
  "/:id/edit",
  IsLoggedIn,
  isOwner,
  wrapAsync(listingController.editListing)
);

module.exports = router;
