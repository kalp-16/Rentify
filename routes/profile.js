// routes/profile.js

const express = require("express");
const router = express.Router();

const profileController =
require("../controllers/profile");

const {
    isLoggedIn
} = require("../middleware");

router.get(
    "/",
    isLoggedIn,
    profileController.profile
);

module.exports = router;