const sendEmail = require("./email");

const sendBookingCancelledGuest = async (booking) => {

    const html = `
    <div style="max-width:600px;margin:auto;font-family:Arial;padding:40px;border:1px solid #eee;border-radius:10px;">

        <h2 style="color:#ff385c;">
            Booking Cancelled
        </h2>

        <p>

            Hi <strong>${booking.guest.fullName}</strong>,

        </p>

        <p>

            Your booking has been cancelled successfully.

        </p>

        <hr>

        <p>

            <strong>Property:</strong>
            ${booking.property.title}

        </p>

        <p>

            <strong>Check In:</strong>
            ${new Date(booking.checkIn).toLocaleDateString()}

        </p>

        <p>

            <strong>Check Out:</strong>
            ${new Date(booking.checkOut).toLocaleDateString()}

        </p>

        <p>

            We hope to welcome you again soon.

        </p>

        <br>

        <p>

            Team Rentify

        </p>

    </div>
    `;
    await sendEmail(
        booking.guest.email,
        "Booking Cancelled - Rentify",
        html
    );
};
module.exports = sendBookingCancelledGuest;