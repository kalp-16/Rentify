const express = require("express");
const router = express.Router();
const user = require("../models/users.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");

router.get("/signup",(req,res)=> {
    res.render("user/signup.ejs");
});
router.post("/signup", async (req,res) => {
    try {
        let {username,email,password} = req.body;
        const newUser = new user({email,username});
        const registeredUser = await user.register(newUser,password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to Rentify!!");
            res.redirect("/listings");
        });
    } catch (e) {
        req.flash("error",e.message);
        res.redirect("/signup");
    }
});
router.get("/login",(req,res) =>{
    res.render("user/login.ejs");
});
router.post("/login",saveRedirectUrl,
    passport.authenticate("local",{failureRedirect: "/login",failureFlash: true,}),
    async (req,res) => {
        req.flash("success","Welcome back to Rentify!!");    
        let redirectUrl = res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl);     
    }
);
router.get("/logout",(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","you are logged out!!");
        res.redirect("/listings");
    });
});

module.exports = router;