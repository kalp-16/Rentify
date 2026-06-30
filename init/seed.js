require("dotenv").config();

const mongoose = require("mongoose");

// ===============================
// MODELS
// ===============================

const User = require("../models/users");
const Listing = require("../models/listing");
const Review = require("../models/reviews");
const Booking = require("../models/bookings");

// ===============================
// GENERATORS
// ===============================

const generateUsers = require("./usersData");
const generateListings = require("./listingsData");
const generateReviews = require("./reviewsData");
const generateBookings = require("./bookingsData");

// ===============================
// DATABASE
// ===============================

const dbUrl =
    process.env.ATLASDB_URL ||
    "mongodb://127.0.0.1:27017/rentify";

// ===============================
// CONNECT DB
// ===============================

async function connectDB() {

    await mongoose.connect(dbUrl);

    console.log("MongoDB Connected");

}

// ===============================
// SEED DATABASE
// ===============================

async function seedDatabase() {

    try {

        console.log("\n==============================");
        console.log(" RENTIFY DATABASE SEED");
        console.log("==============================\n");

        // ===============================
        // CLEAR DATABASE
        // ===============================

        console.log("Clearing Existing Data...\n");

        await Booking.deleteMany({});
        await Review.deleteMany({});
        await Listing.deleteMany({});
        await User.deleteMany({});

        console.log("Database Cleared Successfully.\n");

        // ===============================
        // USERS
        // ===============================

        const {

            admin,

            hosts,

            guests,

            users

        } = await generateUsers();

        // ===============================
        // LISTINGS
        // ===============================

        const listings = await generateListings(hosts);

        // ===============================
        // REVIEWS
        // ===============================

        const reviews = await generateReviews(

            guests,

            listings

        );

        // ===============================
        // BOOKINGS
        // ===============================

        const bookings = await generateBookings(

            guests,
            listings

        );

        console.log("\n==================================");
        console.log(" DATABASE SEEDED SUCCESSFULLY");
        console.log("==================================\n");
        console.log(`Users      : ${users.length}`);
        console.log(`Admin      : 1`);
        console.log(`Hosts      : ${hosts.length}`);
        console.log(`Guests     : ${guests.length}`);
        console.log(`Listings   : ${listings.length}`);
        console.log(`Reviews    : ${reviews.length}`);
        console.log(`Bookings   : ${bookings.length}`);
        console.log("\n==================================");
        console.log("Default Login Password");
        console.log("Rentify@123");
        console.log("==================================\n");
        process.exit(0);

    }

    catch (err) {

        console.log(err);

        process.exit(1);

    }

}

// ===============================
// START
// ===============================

connectDB()

.then(() => {

    seedDatabase();

})

.catch((err) => {

    console.log(err);

});