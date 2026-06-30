const Listing = require("../models/listing");

const {

    propertyTypes,

    listingTypes,

    randomElement,

    randomPlace,

    randomFacilities,

    randomPrice,

    randomBedrooms,

    randomBathrooms,

    randomMaxGuests,

    generateTitle,

    generateDescription,

    randomFloat,

    getImages

} = require("./helper");


// ==========================================
// GENERATE LISTINGS
// ==========================================

async function generateListings(hosts){

    console.log("\nCreating Listings...\n");

    await Listing.deleteMany({});

    const listings=[];

    let hostIndex=0;

    for(let i=0;i<150;i++){

        const propertyType=
        randomElement(propertyTypes);

        const place=
        randomPlace();

        const host=
        hosts[hostIndex];

        hostIndex++;

        if(hostIndex>=hosts.length){

            hostIndex=0;

        }

        const listing=new Listing({

            title:
            generateTitle(propertyType),

            description:
            generateDescription(),

            propertyType,

            listingType:
            randomElement(listingTypes),

            location:
            `${place.city}, ${place.state}`,

            city:
            place.city,

            state:
            place.state,

            coordinates:
            place.coordinates,

            image:
            getImages(propertyType),

            owner:
            host._id,

            price:
            randomPrice(),

            bedrooms:
            randomBedrooms(),

            bathrooms:
            randomBathrooms(),

            maxGuests:
            randomMaxGuests(),

            facilities:
            randomFacilities(),

            bookingMode:
            Math.random()<0.6
            ?"manual"
            :"auto",

            averageRating:0,

            reviews:[],

            unavailableDates:[],

            status:"published"

        });

        listings.push(listing);

    }

    const savedListings = await Listing.insertMany(listings);

    console.log(`${savedListings.length} Listings Created`);

return savedListings;

}

module.exports=generateListings;
