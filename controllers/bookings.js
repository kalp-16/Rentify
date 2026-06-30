const Booking = require("../models/bookings");
const Listing = require("../models/listing");
const sendEmail = require("../utils/email");
const sendBookingCancelledGuest =
require("../utils/sendBookingCancelledGuest");

const sendBookingCancelledHost =
require("../utils/sendBookingCancelledHost");
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
        if (listing.owner && listing.owner.email) {
            await sendEmail(
                listing.owner.email,

                "New Booking Request - Rentify",

                `
                <h2>New Booking Request</h2>

                <p>
                A guest has requested to stay at your property.
                </p>

                <hr>

                <p><strong>Property:</strong> ${listing.title}</p>

                <p><strong>Guest:</strong> ${req.user.username}</p>

                <p><strong>Check In:</strong> ${checkIn}</p>

                <p><strong>Check Out:</strong> ${checkOut}</p>

                <p><strong>Guests:</strong> ${guests}</p>

                <br>

                <p>
                Login to Rentify to approve or reject the request.
                </p>
                `
            );
        }
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
module.exports.cancelBooking = async (req,res)=>{

    try{

        const booking = await Booking.findById(req.params.id)
        .populate("guest")
        .populate("host")
        .populate("property");

        if(!booking){

            req.flash(
                "error",
                "Booking not found."
            );

            return res.redirect("/bookings/my");

        }

        if(
            booking.guest._id.toString() !==
            req.user._id.toString()
        ){

            req.flash(
                "error",
                "Unauthorized action."
            );

            return res.redirect("/bookings/my");

        }

        if(
            booking.status==="cancelled" ||
            booking.status==="rejected"
        ){

            req.flash(
                "error",
                "This booking cannot be cancelled."
            );

            return res.redirect("/bookings/my");

        }

        // -----------------------------------
        // Free unavailable dates
        // -----------------------------------

        if(booking.status==="approved"){

            const listing = booking.property;

            listing.unavailableDates =
            listing.unavailableDates.filter(date=>{

                return !(
                    date>=booking.checkIn &&
                    date<booking.checkOut
                );

            });

            await listing.save();

        }

        // -----------------------------------
        // Cancel booking
        // -----------------------------------

        booking.status="cancelled";

        await booking.save();

        // -----------------------------------
        // Emails
        // -----------------------------------

        await sendBookingCancelledGuest(
            booking
        );

        await sendBookingCancelledHost(
            booking
        );

        req.flash(

            "success",

            "Booking cancelled successfully."

        );

        res.redirect("/bookings/my");

    }

    catch(err){
        
        console.log(err);

        req.flash(
            "error",
            "Unable to cancel booking."
        );

        res.redirect("/bookings/my");

    }

};

module.exports.approveBooking = async (req, res) => {

    const booking = await Booking.findById(req.params.id)
        .populate("property")
        .populate("guest");
    if (!booking) {
        req.flash("error", "Booking not found");
        return res.redirect("/bookings/host");
    }

    if (
        booking.host.toString() !==
        req.user._id.toString()
    ) {
        req.flash("error", "Unauthorized");
        return res.redirect("/bookings/host");
    }

    booking.status = "approved";

    await booking.save();

    const listing = booking.property;

    const dates = [];
    const current = new Date(booking.checkIn);

    while (current < booking.checkOut) {
        dates.push(new Date(current));
        current.setDate(current.getDate() + 1);
    }

    listing.unavailableDates.push(...dates);

    await listing.save();
        await sendEmail(

        booking.guest.email,

        "Booking Confirmed - Rentify",

        `
        <h2>🎉 Booking Confirmed</h2>

        <p>
        Your booking has been approved.
        </p>

        <hr>

        <p>
        <strong>Property:</strong>
        ${listing.title}
        </p>

        <p>
        <strong>Check In:</strong>
        ${booking.checkIn.toDateString()}
        </p>

        <p>
        <strong>Check Out:</strong>
        ${booking.checkOut.toDateString()}
        </p>

        <p>
        <strong>Total Price:</strong>
        ₹${booking.totalPrice}
        </p>

        <br>

        <p>
        Thank you for choosing Rentify ❤️
        </p>
        `
    );
    req.flash(
        "success",
        "Booking approved"
    );

    res.redirect("/bookings/host");
};
module.exports.rejectBooking = async (req, res) => {
    const booking =
        await Booking.findById(req.params.id).populate("guest").populate("property");
    if (!booking) {
        req.flash(
            "error",
            "Booking not found"
        );
        return res.redirect("/bookings/host");
    }
    if (
        booking.host.toString() !==
        req.user._id.toString()
    ) {
        req.flash(
            "error",
            "Unauthorized"
        );
        return res.redirect("/bookings/host");
    }
    booking.status = "rejected";
    await booking.save();
    await sendEmail(

        booking.guest.email,

        "Booking Request Update - Rentify",

        `
        <h2>Booking Request Update</h2>

        <p>
        Unfortunately the host could not approve your booking.
        </p>

        <hr>

        <p>
        <strong>Property:</strong>
        ${booking.property.title}
        </p>

        <p>
        You may browse other available properties on Rentify.
        </p>

        <br>

        <p>
        Thank you for using Rentify.
        </p>
        `
    );
    req.flash(
        "success",
        "Booking rejected"
    );
    res.redirect("/bookings/host");
};