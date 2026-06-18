const express = require("express");
const router = express.Router();

const bookingController = require("../controllers/bookings");
const { isLoggedIn } = require("../middleware");

// Guest creates booking
router.post(
    "/:id/book",
    isLoggedIn,
    bookingController.createBooking
);

// Guest bookings
router.get(
    "/my",
    isLoggedIn,
    bookingController.myBookings
);

// Host bookings
router.get(
    "/host",
    isLoggedIn,
    bookingController.hostBookings
);

// Cancel booking
router.patch(
    "/:id/cancel",
    isLoggedIn,
    bookingController.cancelBooking
);

module.exports = router;