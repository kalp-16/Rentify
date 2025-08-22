const mongoose = require("mongoose");
const Review = require("./reviews");
const Schema = mongoose.Schema;

// Custom validator to block "null", "undefined", and empty string
const notNullString = {
  type: String,
  required: [true, "This field is required."],
  trim: true,
  validate: {
    validator: function (v) {
      return v && v.toLowerCase() !== "null" && v.toLowerCase() !== "undefined";
    },
    message: "Invalid value. Cannot be 'null' or 'undefined'.",
  },
};

const listingSchema = new Schema({
  title: notNullString,
  description: notNullString,
  location: notNullString,
  country: notNullString,

  image: [
    {
      url: String,
      filename: String,
    },
  ],

  propertyType: {
    type: String,
    enum: [
      "Hotel",
      "Resort",
      "Bungalow",
      "Apartment",
      "Cabin",
      "Cottage",
      "Glamping",
      "Hostel",
      "Ryokan",
      "Farmhouse",
      "Boat",
      "Tent",
      "Villa",
      "Other",
    ],
    required: true,
  },

  facilities: {
    type: [String],
    enum: [
      "Wifi",
      "Swimming Pool",
      "Spa & Wellness",
      "Restaurant",
      "AC",
      "Kitchen",
      "Free Parking",
      "Washing Machine",
      "Laundry",
      "TV",
      "Pet Friendly",
      "Gym",
      "Bar",
      "Breakfast",
      "Family Friendly",
      "Business Center",
      "Airport Shuttle",
      "Fireplace",
      "Outdoor Space",
      "Smoke Alarm",
    ],
  },

  price: {
    type: Number,
    min: [0, "Price must be a positive number."],
  },

  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],

  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

// Middleware: Delete reviews when a listing is deleted
listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
