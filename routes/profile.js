// routes/profile.js

const express = require("express");
const router = express.Router();

const profileController =
require("../controllers/profile");

const { isLoggedIn } =
require("../middleware");

const multer = require("multer");
const { storage } =
require("../cloudConfig");

const upload =
multer({ storage });

router.get(
    "/",
    isLoggedIn,
    profileController.profile
);

router.get(
    "/edit",
    isLoggedIn,
    profileController.renderEditProfile
);

router.put(
    "/edit",
    isLoggedIn,
    upload.single("profileImage"),
    profileController.updateProfile
);

module.exports = router;