// routes/wishlist.js

const express = require("express");
const router = express.Router();

const wishlistController =
require("../controllers/wishlist");

const {
    isLoggedIn
} = require("../middleware");

router.get(
    "/wishlist",
    isLoggedIn,
    wishlistController.showWishlist
);

router.post(
    "/wishlist/:id",
    isLoggedIn,
    wishlistController.toggleWishlist
);

module.exports = router;