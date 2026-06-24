// controllers/profile.js

const User = require("../models/users");
const Listing = require("../models/listing");
const Booking = require("../models/bookings");

module.exports.profile = async (req,res)=>{

    const user =
    await User.findById(req.user._id)
    .populate("wishlist");
    const myListings =
    await Listing.find({
        owner:req.user._id
    });
    const myBookings =
    await Booking.find({
        guest:req.user._id
    }).populate("property");
    const hostBookings =
    await Booking.find({
        host:req.user._id,
        status:"pending"
    }).populate("property");
    res.render(
        "profile/index.ejs",
        {
            user,
            myListings,
            myBookings,
            hostBookings
        }
    );
};

module.exports.renderEditProfile = async (req,res)=>{
    const user =
    await User.findById(req.user._id);  
    res.render(
        "profile/edit.ejs",
        { user }
    );
};

module.exports.updateProfile =
async(req,res)=>{
    try{
        const user =
        await User.findById(
            req.user._id
        );
        user.username =
        req.body.username;
        if(req.file){
            user.profileImage = {
                url:req.file.path,
                filename:req.file.filename
            };
        }
        await user.save();
        req.flash(
            "success",
            "Profile updated successfully"
        );
        res.redirect("/profile");
    }catch(err){
        console.log(err);
        req.flash(
            "error",
            "Could not update profile"
        );
        res.redirect("/profile/edit");
    }
};