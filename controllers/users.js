const User = require("../models/users.js");
const generateVerificationToken = require("../utils/generateVerificationToken");
const sendVerificationEmail = require("../utils/sendVerificationEmail");
const crypto = require("crypto");
const sendResetPasswordEmail = require("../utils/sendResetPasswordEmail");
// ==========================================
// Render Signup
// ==========================================

module.exports.renderSignup = (req, res) => {
    res.render("user/signup.ejs");
};

// ==========================================
// Signup
// ==========================================

module.exports.signup = async (req, res, next) => {

    try {

        const {
            fullName,
            username,
            email,
            password
        } = req.body;

        // -----------------------------
        // Basic Validation
        // -----------------------------

        if (!fullName || !username || !email || !password) {

            req.flash("error", "All fields are required.");

            return res.redirect("/signup");

        }

        const normalizedUsername = username.trim().toLowerCase();
        const normalizedEmail = email.trim().toLowerCase();
        const normalizedFullName = fullName.trim();

        // -----------------------------
        // Existing User Check
        // -----------------------------

        const existingEmail = await User.findOne({
            email: normalizedEmail
        });

        if (existingEmail) {

            req.flash("error", "Email is already registered.");

            return res.redirect("/signup");

        }

        const existingUsername = await User.findOne({
            username: normalizedUsername
        });

        if (existingUsername) {

            req.flash("error", "Username is already taken.");

            return res.redirect("/signup");

        }

        // -----------------------------
        // Create User
        // -----------------------------

        const newUser = new User({

            fullName: normalizedFullName,

            username: normalizedUsername,

            email: normalizedEmail,

            isVerified: false

        });

        // -----------------------------
        // Profile Image (Optional)
        // -----------------------------

        if (req.file) {

            newUser.profileImage = {

                url: req.file.path,

                filename: req.file.filename

            };

        }

        // -----------------------------
        // Verification Token
        // -----------------------------

        const token = generateVerificationToken();

        newUser.verificationToken = token;

        newUser.verificationTokenExpires = new Date(

            Date.now() + 24 * 60 * 60 * 1000

        );

        // -----------------------------
        // Register User
        // -----------------------------

        const registeredUser = await User.register(

            newUser,

            password

        );

        // -----------------------------
        // Send Verification Email
        // -----------------------------

        await sendVerificationEmail(

            registeredUser,

            token

        );

        req.flash(

            "success",

            "Verification email sent successfully. Please verify your email before logging in."

        );

        res.redirect("/login");

    }

    catch (err) {

        console.log(err);

        req.flash(

            "error",

            err.message

        );

        res.redirect("/signup");

    }

};

// ==========================================
// Verify Email
// ==========================================

module.exports.verifyEmail = async (req, res) => {

    try {

        const { token } = req.params;

        const user = await User.findOne({

            verificationToken: token,

            verificationTokenExpires: {

                $gt: Date.now()

            }

        });

        if (!user) {

            req.flash(

                "error",

                "Verification link is invalid or has expired."

            );

            return res.redirect("/signup");

        }

        user.isVerified = true;

        user.verificationToken = "";

        user.verificationTokenExpires = undefined;

        await user.save();

        req.flash(

            "success",

            "Email verified successfully. You can now login."

        );

        res.redirect("/login");

    }

    catch (err) {

        console.log(err);

        req.flash(

            "error",

            "Unable to verify email."

        );

        res.redirect("/signup");

    }

};
module.exports.renderForgotPassword = (req,res)=>{

    res.render("user/forgotPassword");

};
module.exports.forgotPassword = async(req,res)=>{

    try{

        const { email } = req.body;

        const user = await User.findOne({

            email: email.trim().toLowerCase()

        });

        if(!user){

            req.flash(
                "error",
                "No account found with that email."
            );

            return res.redirect("/forgot-password");

        }

        const token =
            crypto.randomBytes(32).toString("hex");

        user.resetPasswordToken =
            token;

        user.resetPasswordExpires =
            Date.now()+60*60*1000;

        await user.save();

        await sendResetPasswordEmail(
            user,
            token
        );

        req.flash(

            "success",

            "Password reset email sent."

        );

        res.redirect("/login");

    }

    catch(err){

        console.log(err);

        req.flash(
            "error",
            "Something went wrong."
        );

        res.redirect("/forgot-password");

    }

};
module.exports.renderResetPassword = async(req,res)=>{

    const { token } = req.params;

    const user = await User.findOne({

        resetPasswordToken:token,

        resetPasswordExpires:{

            $gt:Date.now()

        }

    });

    if(!user){

        req.flash(
            "error",
            "Reset link expired."
        );

        return res.redirect("/forgot-password");

    }

    res.render(

        "user/resetPassword",

        { token }

    );

};
module.exports.resetPassword = async(req,res)=>{

    try{

        const { token } = req.params;

        const { password } = req.body;

        const user = await User.findOne({

            resetPasswordToken:token,

            resetPasswordExpires:{

                $gt:Date.now()

            }

        });

        if(!user){

            req.flash(
                "error",
                "Reset link expired."
            );

            return res.redirect("/forgot-password");

        }

        await user.setPassword(password);

        user.resetPasswordToken="";

        user.resetPasswordExpires=undefined;

        await user.save();

        req.flash(

            "success",

            "Password updated successfully."

        );

        res.redirect("/login");

    }

    catch(err){

        console.log(err);

        req.flash(
            "error",
            err.message
        );

        res.redirect("/forgot-password");

    }

};
// ==========================================
// Render Login
// ==========================================

module.exports.renderLogin = (req, res) => {

    res.render("user/login.ejs");

};

// ==========================================
// Login with Username or Email
// ==========================================

module.exports.loginWithEmailOrUsername = async (req, res, next) => {

    try {

        const { username } = req.body;

        if (!username) {

            return next();

        }

        // Check if input is an email
        if (username.includes("@")) {

            const user = await User.findOne({

                email: username.trim().toLowerCase()

            });

            if (user) {

                // Passport expects username
                req.body.username = user.username;

            }

        }

        next();

    }

    catch (err) {

        next(err);

    }

};

// ==========================================
// Login Callback
// ==========================================

module.exports.loginCallback = async (req, res) => {

    try {

        const user = await User.findById(req.user._id);

        if (!user.isVerified) {

            req.logout((err) => {

                if (err) {

                    console.log(err);

                }

            });

            req.flash(

                "error",

                "Please verify your email before logging in."

            );

            return res.redirect("/login");

        }

        req.flash(

            "success",

            `Welcome back, ${user.fullName}!`

        );

        const redirectUrl =

            res.locals.redirectUrl || "/listings";

        res.redirect(redirectUrl);

    }

    catch (err) {

        console.log(err);

        req.flash(

            "error",

            "Login failed."

        );

        res.redirect("/login");

    }

};

// ==========================================
// Logout
// ==========================================

module.exports.logout = (req, res, next) => {

    req.logout((err) => {

        if (err) {

            return next(err);

        }

        req.flash(

            "success",

            "You have been logged out successfully."

        );

        res.redirect("/listings");

    });

};