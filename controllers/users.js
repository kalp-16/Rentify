const User = require("../models/users.js");

module.exports.renderSignup = (req, res) => {
  res.render("user/signup.ejs");
};

module.exports.signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const normalizedUsername = typeof username === "string" ? username.trim() : "";
    const normalizedEmail = typeof email === "string" ? email.trim() : "";

    if (!normalizedUsername || normalizedUsername === "null" || normalizedUsername === "undefined") {
      req.flash("error", "Username null or undefined is not allowed.");
      return res.redirect("/signup");
    }

    if (!normalizedEmail || !password) {
      req.flash("error", "Username, email, and password are required.");
      return res.redirect("/signup");
    }

    const newUser = new User({ email: normalizedEmail, username: normalizedUsername });
    const registeredUser = await User.register(newUser, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to Rentify!!");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

module.exports.renderLogin = (req, res) => {
  res.render("user/login.ejs");
};

module.exports.loginCallback = (req, res) => {
  req.flash("success", "Welcome back to Rentify!!");
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
  req.logOut((err) => {
    if (err) return next(err);
    req.flash("success", "you are logged out!!");
    res.redirect("/listings");
  });
};
