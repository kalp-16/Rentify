const Review = require("../models/reviews");

const {

    randomElement,

    randomFloat,

    randomInt,

    randomReview

} = require("./helper");

async function generateReviews(

    guests,

    listings

){

    console.log("\nCreating Reviews...\n");

    await Review.deleteMany({});

    const allReviews=[];

    for(const listing of listings){

        const usedGuests=new Set();

        const totalReviews=

        randomInt(3,7);

        let totalRating=0;

        listing.reviews=[];

        for(let i=0;i<totalReviews;i++){

            let guest=

            randomElement(guests);

            while(

                usedGuests.has(

                    guest._id.toString()

                )

            ){

                guest=

                randomElement(

                    guests

                );

            }

            usedGuests.add(

                guest._id.toString()

            );

            const rating=

            randomFloat(

                3.5,

                5,

                1

            );

            totalRating+=rating;

            const review=

            new Review({

                author:

                guest._id,

                property:

                listing._id,

                rating,

                comment:

                randomReview()

            });

            await review.save();

            listing.reviews.push(

                review._id

            );

            allReviews.push(

                review

            );

        }

        listing.averageRating=

        Number(

            (

                totalRating/

                totalReviews

            ).toFixed(1)

        );

        await listing.save();

    }

    console.log(

        `${allReviews.length} Reviews Created`

    );

    return allReviews;

}

module.exports=

generateReviews;