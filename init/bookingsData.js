const Booking = require("../models/bookings");

const {

    randomElement,

    randomInt,

    randomBookingStatus

} = require("./helper");

// ==========================================
// DATE HELPERS
// ==========================================

function randomCheckIn() {

    const start = new Date(2026, 0, 1);

    const end = new Date(2026, 11, 20);

    return new Date(

        start.getTime() +

        Math.random() *

        (end.getTime() - start.getTime())

    );

}

function addDays(date, days) {

    const d = new Date(date);

    d.setDate(

        d.getDate() + days

    );

    return d;

}

// ==========================================
// SPECIAL REQUESTS
// ==========================================

const requests = [

    "",

    "Late check-in",

    "Early check-in",

    "Need airport pickup",

    "Extra towels",

    "High floor room",

    "Birthday decoration",

    "Anniversary setup",

    "Quiet room",

    "Vegetarian breakfast"

];

// ==========================================
// GENERATE BOOKINGS
// ==========================================

async function generateBookings(

    guests,

    listings

) {

    console.log("\nCreating Bookings...\n");

    await Booking.deleteMany({});

    const bookings = [];

    for (const listing of listings) {

        const bookingCount = randomInt(2, 4);

        const usedGuests = new Set();

        for (let i = 0; i < bookingCount; i++) {

            let guest = randomElement(guests);

            while (

                usedGuests.has(

                    guest._id.toString()

                )

            ) {

                guest = randomElement(guests);

            }

            usedGuests.add(

                guest._id.toString()

            );

            const checkIn = randomCheckIn();

            const nights = randomInt(1, 7);

            const checkOut = addDays(

                checkIn,

                nights

            );

            const status =

                randomBookingStatus();

            let paymentStatus = "pending";

            if (

                status === "approved" ||

                status === "completed"

            ) {

                paymentStatus = "paid";

            }

            if (

                status === "cancelled"

            ) {

                paymentStatus =

                Math.random() < 0.5

                ? "paid"

                : "refunded";

            }

            const booking = new Booking({

                property:

                listing._id,

                guest:

                guest._id,

                host:

                listing.owner,

                guestName:

                guest.fullName,

                guestEmail:

                guest.email,

                checkIn,

                checkOut,

                guests:

                randomInt(

                    1,

                    listing.maxGuests

                ),

                totalPrice:

                listing.price *

                nights,

                bookingMode:

                listing.bookingMode,

                status,

                paymentStatus,

                specialRequests:

                randomElement(

                    requests

                ),

                cancellationReason:

                status === "cancelled"

                ? "Change of plans"

                : "",

                reviewSubmitted:

                status === "completed"

                ? Math.random() < 0.7

                : false

            });

            await booking.save();

            bookings.push(

                booking

            );

            // ============================
            // BLOCK DATES
            // ============================

            if (

                status === "approved" ||

                status === "completed"

            ) {

                let current =

                new Date(checkIn);

                while (

                    current <= checkOut

                ) {

                    listing.unavailableDates.push(

                        new Date(current)

                    );

                    current = addDays(

                        current,

                        1

                    );

                }

            }

        }

        await listing.save();

    }

    console.log(

        `${bookings.length} Bookings Created`

    );

    return bookings;

}

module.exports = generateBookings;