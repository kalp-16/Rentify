const express = require("express");
const router = express.Router();
const user = require("../models/users.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");
const userController = require("../controllers/users.js");

router.route('/signup')
  .get(userController.renderSignup)
  .post(userController.signup);

router.route('/login')
  .get(userController.renderLogin)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }),
    userController.loginCallback
  );

router.route('/logout').get(userController.logout);

module.exports = router;