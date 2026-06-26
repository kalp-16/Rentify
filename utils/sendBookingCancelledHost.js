const sendEmail = require("./email");

const sendBookingCancelledHost = async (booking) => {

    const html = `
    <div style="max-width:600px;margin:auto;font-family:Arial;padding:40px;border:1px solid #eee;border-radius:10px;">

        <h2 style="color:#ff385c;">
            Guest Cancelled Booking
        </h2>

        <p>

            Hi,

        </p>

        <p>

            <strong>${booking.guest.fullName}</strong>

            has cancelled their booking.

        </p>

        <hr>

        <p>

            <strong>Property:</strong>

            ${booking.property.title}

        </p>

        <p>

            <strong>Guest:</strong>

            ${booking.guest.fullName}

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

            Your property is now available for new bookings.

        </p>

        <br>

        <p>

            Team Rentify

        </p>

    </div>
    `;

    await sendEmail(

        booking.property.owner.email,

        "Guest Cancelled Booking - Rentify",

        html

    );

};

module.exports = sendBookingCancelledHost;