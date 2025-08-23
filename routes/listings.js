const express = require("express");
const router = express.Router();
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const {isLoggedIn,isOwner,loadListing} = require("../middleware.js")
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});
const cloudinary = require("cloudinary").v2;

const listingContoller = require("../controllers/listings.js");

router.get("/", listingContoller.index);

router.get('/search', async (req, res) => {
    const { q } = req.query;

    if (!q || q.trim() === '') {
        return res.render("listings/search", { 
            listings: [], 
            searchQuery: "", 
            flashMessage: { type: "error", text: "Please enter a destination to search." } 
        });
    }

    const searchQuery = new RegExp(q.trim(), 'i');
    const searchResults = await Listing.find({
        $or: [
            { title: { $regex: searchQuery } },
            { location: { $regex: searchQuery } },
            { country: { $regex: searchQuery } }
        ]
    });

    let flashMessage = null;
    if (searchResults.length === 0) {
        flashMessage = { type: "info", text: `No listings found for "${q}".` };
    } else {
        flashMessage = { type: "success", text: `Found ${searchResults.length} listings for "${q}".` };
    }

    res.render("listings/search", { 
        listings: searchResults, 
        searchQuery: q,
        flashMessage 
    });
});


// merged upload + create route
router.post(
  "/",
  isLoggedIn,
  upload.single("listing[image]",10), 
  async (req, res) => {
    try {
      const listingData = req.body.listing;
      const listing = new Listing(listingData);
      listing.owner = req.user._id;

      // Save uploaded images
      if (req.files && req.files.length > 0) {
        listing.image = req.files.map(f => ({
          url: f.path,
          filename: f.filename,
        }));
      }

      await listing.save();
      req.flash("success", "Listing created successfully!");
      res.redirect("/listings");
    } catch (err) {
      console.error("Create failed:", err);
      req.flash("error", err.message || "Something went wrong!");
      res.redirect("/listings/new");
    }
  });


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

    let avgRating = 0;
    if (listing.reviews.length > 0) {
        let totalRating = listing.reviews.reduce((sum, review) => sum + review.rating, 0);
        avgRating = (totalRating / listing.reviews.length).toFixed(1);
    }

    res.render("listings/show.ejs", { listing, avgRating });
});

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
/*router.put("/:id", isLoggedIn, upload.array("listing[image]", 10), isOwner, async (req, res) => {
  try {
    const listing = req.listing;
    const data = req.body?.listing || {};

    Object.assign(listing, data);

    // If new images were uploaded, add them to the images array
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(f => ({ url: f.path, filename: f.filename }));
      listing.image = listing.image.concat(newImages);
    }

    await listing.save();

    req.flash("success", "Listing updated!!");
    res.redirect(`/listings/${listing._id}`);
  } catch (err) {
    console.error("Update failed:", err);
    req.flash("error", "Something went wrong!");
    res.redirect("/listings");
  }
});*/
router.put("/:id", isLoggedIn, isOwner, upload.array("listing[image]", 10), async (req, res) => {
  try {
    const listing = req.listing; 
    const data = req.body?.listing || {};

    Object.assign(listing, data);

    // Add new uploaded images
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(f => ({
        url: f.path,
        filename: f.filename,
      }));
      listing.image.push(...newImages);
    }

    // Handle image deletion
    if (req.body.deleteImages) {
      for (let filename of req.body.deleteImages) {
        // remove from Cloudinary
        await cloudinary.uploader.destroy(filename);

        // remove from DB array
        listing.image = listing.image.filter(img => img.filename !== filename);
      }
    }

    await listing.save();

    req.flash("success", "Listing updated successfully!");
    res.redirect(`/listings/${listing._id}`);
  } catch (err) {
    console.error("Update failed:", err);
    req.flash("error", err.message || "Something went wrong!");
    res.redirect(`/listings/${listing._id}`);
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