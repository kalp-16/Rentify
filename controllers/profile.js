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