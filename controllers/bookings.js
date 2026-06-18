const Booking = require("../models/bookings");
const Listing = require("../models/listing");

function getDatesBetween(startDate, endDate) {
    const dates = [];
    const current = new Date(startDate);

    while (current < endDate) {
        dates.push(new Date(current));
        current.setDate(current.getDate() + 1);
    }

    return dates;
}

// Create Booking
module.exports.createBooking = async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id)
            .populate("owner");

        if (!listing) {
            req.flash("error", "Property not found");
            return res.redirect("/listings");
        }

        const {
            checkIn,
            checkOut,
            guests,
            specialRequests
        } = req.body;

        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);

        if (checkOutDate <= checkInDate) {
            req.flash("error", "Invalid booking dates");
            return res.redirect(`/listings/${listing._id}`);
        }

        const bookedDates = getDatesBetween(
            checkInDate,
            checkOutDate
        );

        const isUnavailable = bookedDates.some(date =>
            listing.unavailableDates.some(
                unavailable =>
                    unavailable.toDateString() ===
                    date.toDateString()
            )
        );

        if (isUnavailable) {
            req.flash(
                "error",
                "Selected dates are unavailable"
            );
            return res.redirect(`/listings/${listing._id}`);
        }

        const nights =
            Math.ceil(
                (checkOutDate - checkInDate) /
                (1000 * 60 * 60 * 24)
            );

        const totalPrice =
            nights * listing.price;

        const bookingStatus =
            listing.bookingMode === "auto"
                ? "approved"
                : "pending";

        const booking = new Booking({
            property: listing._id,

            guest: req.user._id,

            host: listing.owner._id,

            guestName: req.user.username,

            guestEmail: req.user.email,

            checkIn: checkInDate,

            checkOut: checkOutDate,

            guests,

            totalPrice,

            bookingMode: listing.bookingMode,

            status: bookingStatus,

            specialRequests
        });

        await booking.save();

        if (listing.bookingMode === "auto") {
            listing.unavailableDates.push(
                ...bookedDates
            );

            await listing.save();
        }

        req.flash(
            "success",
            "Booking request submitted"
        );

        res.redirect("/bookings/my");

    } catch (err) {
        console.log(err);

        req.flash(
            "error",
            "Booking failed"
        );

        res.redirect("/listings");
    }
};

// Guest Bookings
module.exports.myBookings = async (req, res) => {

    const bookings =
        await Booking.find({
            guest: req.user._id
        })
            .populate("property")
            .sort({ createdAt: -1 });

    res.render(
        "bookings/my.ejs",
        { bookings }
    );
};

// Host Bookings
module.exports.hostBookings = async (req, res) => {

    const bookings =
        await Booking.find({
            host: req.user._id
        })
            .populate("property")
            .populate("guest")
            .sort({ createdAt: -1 });

    res.render(
        "bookings/host.ejs",
        { bookings }
    );
};

// Cancel Booking
module.exports.cancelBooking = async (req, res) => {

    const booking =
        await Booking.findById(req.params.id);

    if (!booking) {
        req.flash(
            "error",
            "Booking not found"
        );

        return res.redirect("/bookings/my");
    }

    if (
        booking.guest.toString() !==
        req.user._id.toString()
    ) {
        req.flash(
            "error",
            "Unauthorized"
        );

        return res.redirect("/bookings/my");
    }

    booking.status = "cancelled";

    await booking.save();

    req.flash(
        "success",
        "Booking cancelled"
    );

    res.redirect("/bookings/my");
};