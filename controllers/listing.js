const { query } = require("express");
const listing = require("../models/listing.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
  const allListings = await listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.newRoute = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listings = await listing
    .findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listings) {
    req.flash("error", "Listing Does not exist");
    res.redirect("/listings");
  }
  // console.log(listings);
  res.render("listings/show.ejs", { listings });
};

module.exports.createListing = async (req, res, next) => {
  let responce = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();

  let url = req.file.path;
  let filename = req.file.filename;
  // console.log(url, "..", filename);
  const addListing = new listing(req.body.listing);
  addListing.owner = req.user._id;
  addListing.image = { url, filename };
  addListing.geometry = responce.body.features[0].geometry;
  addListing.category = req.body.listing.category || "mountains";
  let newSavedLis = await addListing.save();
  console.log(newSavedLis);
  req.flash("success", "New listing was created !");
  res.redirect("/listings");
};

module.exports.editListing = async (req, res) => {
  let { id } = req.params;

  const listings = await listing.findById(id);
  if (!listings) {
    req.flash("error", "Listing Does not exist");
    return res.redirect("/listings");
  }
  let originalImgUrl = listings.image.url;
  newImgUrl = originalImgUrl.replace(
    "/upload",
    "/upload/h_250,w_250/e_blur:100"
  );
  res.render("listings/edit.ejs", { listings, newImgUrl });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let Listing = await listing.findByIdAndUpdate(
    id,
    { ...req.body.listing },
    { new: true },
    { runValidators: true } //deconstruted...
  );
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    Listing.image = { url, filename };
    await Listing.save();
  }
  req.flash("success", "Listing was Updated !");
  res.redirect(`/listings/${id}`);
};

module.exports.index = async (req, res) => {
  const { q, category } = req.query;
  let filter = {};

  // console.log("Search Query:", q);
  // console.log("Category Filter:", category);

  if (q) {
    filter.$or = [
      { title: { $regex: q, $options: "i" } },
      { location: { $regex: q, $options: "i" } },
      { country: { $regex: q, $options: "i" } },
      { category: { $regex: q, $options: "i" } },
    ];
  }

  if (category) {
    filter.category = category;
  }

  // console.log("Final Filter:", filter);

  const allListings = await listing.find(filter);
  // console.log("Filtered Listings:", allListings);

  res.render("listings/index.ejs", { allListings });
};

module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  let delListing = await listing.findByIdAndDelete(id);
  console.log(delListing);
  req.flash("success", "Listing was Deleted !");
  res.redirect("/listings");
};
