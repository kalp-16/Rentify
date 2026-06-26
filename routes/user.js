const express = require("express");
const router = express.Router();
const user = require("../models/users.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");
const userController = require("../controllers/users.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router.route("/signup")
    .get(userController.renderSignup)
    .post(
        upload.single("profileImage"),
        userController.signup
    );

router.route("/login")
    .get(userController.renderLogin)
    .post(
        userController.loginWithEmailOrUsername,
        saveRedirectUrl,
        passport.authenticate("local", {
            failureRedirect: "/login",
            failureFlash: true
        }),
        userController.loginCallback
    );

router.get(
    "/verify/:token",
    userController.verifyEmail
);
router.route("/forgot-password")
.get(userController.renderForgotPassword)
.post(userController.forgotPassword);

router.route("/reset-password/:token")
.get(userController.renderResetPassword)
.post(userController.resetPassword);
router.route('/logout').get(userController.logout);

module.exports = router;