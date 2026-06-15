const express = require("express");
const router = express.Router({mergeParams:true});
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/reviews.js");
const Listing = require("../models/listing.js");
const {isLoggedIn,isReviewOwner} = require("../middleware.js")
const reviewController = require("../controllers/reviews.js");

router.route("/").post(isLoggedIn, reviewController.createReview);

router.route("/:reviewId").delete(isLoggedIn, isReviewOwner, reviewController.deleteReview);

module.exports = router;