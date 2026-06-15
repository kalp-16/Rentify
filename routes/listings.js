const express = require("express");
const router = express.Router();
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const {isLoggedIn,isOwner,loadListing} = require("../middleware.js")
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});
const cloudinary = require("cloudinary").v2;

const listingController = require("../controllers/listings.js");

router.route("/")
  .get(listingController.index)
  .post(isLoggedIn, upload.array("listing[image]", 10), listingController.createListing);

router.route('/search').get(listingController.search);

router.route("/new").get(isLoggedIn, listingController.renderNew);

router.route("/:id")
  .get(listingController.showListing)
  .put(isLoggedIn, isOwner, upload.array("listing[image]", 10), listingController.updateListing)
  .delete(isLoggedIn, isOwner, listingController.deleteListing);

router.route("/:id/edit").get(isLoggedIn, isOwner, listingController.editListing);

module.exports = router;