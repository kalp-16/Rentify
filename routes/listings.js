const express = require("express");
const router = express.Router();
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const {isLoggedIn,isOwner,loadListing} = require("../middleware.js")
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});

const listingContoller = require("../controllers/listings.js");

//index route
/*router
  .get("/", listingContoller.index)
  .post(upload.single("listing[image]"), (req, res) => {
    res.send(req.file);
  });*/
// index route
router.get("/", listingContoller.index);

router.get('/search', async (req, res, next) => {
    const { q } = req.query; // Get the search query

    if (!q || q.trim() === '') {
        req.flash('error', 'Please enter a destination to search.');
        return res.redirect('/listings');
    }

    const searchQuery = new RegExp(q.trim(), 'i'); // Case-insensitive regex

    // This part directly uses the fields from your provided Listing schema
    const searchResults = await Listing.find({
        $or: [
            { title: { $regex: searchQuery } },
            { location: { $regex: searchQuery } },
            { country: { $regex: searchQuery } }
        ]
    });

    if (searchResults.length === 0) {
        req.flash('info', `No listings found for "${q}".`);
    } else {
        req.flash('success', `Found ${searchResults.length} listings for "${q}".`);
    }

    res.render('listings/search', { listings: searchResults, searchQuery: q });
});

// merged upload + create route
router.post(
  "/",
  isLoggedIn,
  upload.single("listing[image]"), listingContoller.createListing);


//new route
router.get("/new",isLoggedIn,(req,res) => {
    res.render("listings/new.ejs");
});

//show route
router.get("/:id", async (req, res) => {
    let { id } = req.params;

    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: { path: "author" }
        })
        .populate("owner");

    if (!listing) {
        req.flash("error", "Listing doesn't exist!!");
        return res.redirect("/listings"); 
    }

    res.render("listings/show.ejs", { listing });
});

//create route
/*router.post("/",isLoggedIn,async (req,res) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success","New Listing listed!!");
    res.redirect("/listings");
});*/

//edit route
router.get("/:id/edit",isLoggedIn,isOwner,async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing doesn't exists!!");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{listing});
});

//update route
router.put("/:id", isLoggedIn, upload.single("image"), isOwner, async (req, res) => {
  try {
    const listing = req.listing; // set in isOwner middleware
    const data = req.body?.listing || {};

    // update listing fields from form data
    Object.assign(listing, data);

    // if a new image was uploaded, update it
    if (req.file) {
      listing.image = {
        url: req.file.path,
        filename: req.file.filename
      };
    }

    await listing.save();

    req.flash("success", "Listing updated!!");
    res.redirect(`/listings/${listing._id}`);
  } catch (err) {
    console.error("Update failed:", err);
    req.flash("error", "Something went wrong!");
    res.redirect("/listings");
  }
});

//delete route
router.delete("/:id",isLoggedIn,isOwner,async (req,res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success","Listing deleted!!");
    res.redirect("/listings");
});

module.exports = router;