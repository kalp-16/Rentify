// controllers/wishlist.js

const User = require("../models/users");
const Listing = require("../models/listing");

module.exports.toggleWishlist = async (req,res) => {

    const { id } = req.params;

    const user = await User.findById(req.user._id);

    const exists = user.wishlist.some(
        (item) => (item?._id || item).toString() === id.toString()
    );

    if(exists){

        user.wishlist.pull(id);

        req.flash(
            "success",
            "Removed from wishlist"
        );

    }else{

        user.wishlist.push(id);

        req.flash(
            "success",
            "Added to wishlist"
        );
    }

    await user.save();

    res.redirect(`/listings/${id}`);
};

module.exports.showWishlist = async (req,res) => {

    const user = await User.findById(
        req.user._id
    ).populate("wishlist");

    res.render(
        "wishlist/index.ejs",
        {
            wishlist:user.wishlist
        }
    );
};