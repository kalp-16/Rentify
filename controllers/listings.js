const Listing = require("../models/listing");

module.exports.index = async (req,res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}

module.exports.createListing = async (req, res) => {
    try {
    const listing = new Listing(req.body.listing);
    await listing.save();
    req.flash("success", "Listing created successfully!");
    res.redirect(`/listings/${listing._id}`);
    } catch (err) {
    // Validation errors come here
    req.flash("error", err.message); 
    res.redirect("/listings/new"); 
  }
}