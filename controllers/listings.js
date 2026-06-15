const Listing = require("../models/listing");
const cloudinary = require("cloudinary").v2;

async function geocodeListing(listingData) {
  const queryParts = [listingData.city, listingData.state, "India"]
    .filter(Boolean)
    .map((part) => String(part).trim())
    .filter(Boolean);

  if (queryParts.length === 0) {
    return [];
  }

  const query = queryParts.join(", ");
  const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(query)}`;
  const response = await fetch(url, {
    headers: {
      "User-Agent": "Rentify/1.0",
      "Accept-Language": "en",
    },
  });

  if (!response.ok) {
    return [];
  }

  const results = await response.json();
  if (!Array.isArray(results) || results.length === 0) {
    return [];
  }

  const [match] = results;
  const longitude = Number(match.lon);
  const latitude = Number(match.lat);

  if (Number.isNaN(longitude) || Number.isNaN(latitude)) {
    return [];
  }

  return [longitude, latitude];
}

function countUploadedImages(req) {
  if (req.files && req.files.length > 0) {
    return req.files.length;
  }
  if (req.file) {
    return 1;
  }
  return 0;
}

function normalizeDeleteImages(deleteImages) {
  if (!deleteImages) return [];
  return Array.isArray(deleteImages) ? deleteImages : [deleteImages];
}

function buildSafeImages(req) {
  if (req.files && req.files.length > 0) {
    return req.files.map((f) => ({ url: f.path, filename: f.filename }));
  }
  if (req.file) {
    return [{ url: req.file.path, filename: req.file.filename }];
  }
  return [];
}

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.search = async (req, res) => {
  const { q } = req.query;

  if (!q || q.trim() === "") {
    return res.render("listings/search", {
      listings: [],
      searchQuery: "",
      flashMessage: { type: "error", text: "Please enter a destination to search." },
    });
  }

  const searchQuery = new RegExp(q.trim(), "i");
  const searchResults = await Listing.find({
    $or: [
      { title: { $regex: searchQuery } },
      { location: { $regex: searchQuery } },
      { city: { $regex: searchQuery } },
      { state: { $regex: searchQuery } },
    ],
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
    flashMessage,
  });
};

module.exports.createListing = async (req, res) => {
  try {
    const listingData = req.body.listing || {};
    const uploadedImages = buildSafeImages(req);
    const coordinates = await geocodeListing(listingData);

    if (uploadedImages.length < 3) {
      req.flash("error", "Please upload a minimum of 3 images to continue.");
      return res.redirect("/listings/new");
    }

    if (coordinates.length !== 2) {
      req.flash("error", "We could not find coordinates for the selected state and city. Please choose a valid location.");
      return res.redirect("/listings/new");
    }

    const listing = new Listing(listingData);
    if (req.user) listing.owner = req.user._id;

    listing.image = uploadedImages;
    listing.coordinates = coordinates;

    await listing.save();
    req.flash("success", "Listing created successfully!");
    res.redirect("/listings");
  } catch (err) {
    console.error("Create failed:", err);
    req.flash("error", err.message || "Something went wrong!");
    res.redirect("/listings/new");
  }
};

module.exports.renderNew = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing doesn't exist!!");
    return res.redirect("/listings");
  }

  let avgRating = 0;
  if (listing.reviews && listing.reviews.length > 0) {
    let totalRating = listing.reviews.reduce((sum, review) => sum + review.rating, 0);
    avgRating = (totalRating / listing.reviews.length).toFixed(1);
  }

  if (!Array.isArray(listing.coordinates) || listing.coordinates.length !== 2) {
    const coordinates = await geocodeListing(listing);
    if (coordinates.length === 2) {
      listing.coordinates = coordinates;
      await listing.save();
    }
  }

  res.render("listings/show.ejs", { listing, avgRating });
};

module.exports.editListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing doesn't exists!!");
    return res.redirect("/listings");
  }
  res.render("listings/edit.ejs", { listing });
};

module.exports.updateListing = async (req, res) => {
  try {
    const listing = req.listing || (await Listing.findById(req.params.id));
    const data = req.body?.listing || {};
    const newImages = buildSafeImages(req);
    const deleteImages = normalizeDeleteImages(req.body.deleteImages);
    const coordinates = await geocodeListing(data);

    Object.assign(listing, data);

    if (coordinates.length !== 2) {
      req.flash("error", "We could not find coordinates for the selected state and city. Please choose a valid location.");
      return res.redirect(`/listings/${listing._id}/edit`);
    }

    listing.coordinates = coordinates;

    const retainedImages = (listing.image || []).filter((img) => !deleteImages.includes(img.filename));

    if (newImages.length > 0) {
      listing.image = retainedImages.concat(newImages);
    } else {
      listing.image = retainedImages;
    }

    for (let filename of deleteImages) {
        await cloudinary.uploader.destroy(filename);
      }

    await listing.save();

    req.flash("success", "Listing updated successfully!");
    res.redirect(`/listings/${listing._id}`);
  } catch (err) {
    console.error("Update failed:", err);
    req.flash("error", err.message || "Something went wrong!");
    res.redirect(`/listings/${req.params.id}`);
  }
};

module.exports.deleteListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted!!");
  res.redirect("/listings");
};