const fs = require("fs");
const path = require("path");
const imageMap = require("./imageMap.json");
// ======================================================
// RANDOM UTILITIES
// ======================================================

function randomInt(min, max) {

    return Math.floor(
        Math.random() * (max - min + 1)
    ) + min;

}

function randomFloat(min, max, decimals = 1) {

    return Number(

        (
            Math.random() * (max - min) + min
        ).toFixed(decimals)

    );

}

function randomElement(array) {

    return array[
        randomInt(0, array.length - 1)
    ];

}

function shuffle(array) {

    const arr = [...array];

    for (let i = arr.length - 1; i > 0; i--) {

        const j = Math.floor(
            Math.random() * (i + 1)
        );

        [arr[i], arr[j]] = [arr[j], arr[i]];

    }

    return arr;

}

function randomSubset(array, min, max) {

    const copy = shuffle(array);

    const count = randomInt(min, max);

    return copy.slice(0, count);

}

// ======================================================
// PROPERTY TYPES
// (Exactly matching Listing Schema)
// ======================================================

const propertyTypes = [

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

    "Other"

];

// ======================================================
// LISTING TYPES
// ======================================================

const listingTypes = [

    "Entire Property",

    "Private Room",

    "Shared Room"

];

// ======================================================
// FACILITIES
// (Exactly matching Listing Schema)
// ======================================================

const facilities = [

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

    "Smoke Alarm"

];

function randomFacilities() {

    return randomSubset(

        facilities,

        5,

        10

    );

}
// ======================================================
// INDIAN TOURIST LOCATIONS
// ======================================================

const places = [

    {
        city: "Goa",
        state: "Goa",
        coordinates: [73.8278, 15.4989]
    },

    {
        city: "Manali",
        state: "Himachal Pradesh",
        coordinates: [77.1892, 32.2432]
    },

    {
        city: "Shimla",
        state: "Himachal Pradesh",
        coordinates: [77.1734, 31.1048]
    },

    {
        city: "Kasol",
        state: "Himachal Pradesh",
        coordinates: [77.3152, 32.0096]
    },

    {
        city: "Leh",
        state: "Ladakh",
        coordinates: [77.5770, 34.1526]
    },

    {
        city: "Srinagar",
        state: "Jammu & Kashmir",
        coordinates: [74.7973, 34.0837]
    },

    {
        city: "Jaipur",
        state: "Rajasthan",
        coordinates: [75.7873, 26.9124]
    },

    {
        city: "Udaipur",
        state: "Rajasthan",
        coordinates: [73.7125, 24.5854]
    },

    {
        city: "Jaisalmer",
        state: "Rajasthan",
        coordinates: [70.9083, 26.9157]
    },

    {
        city: "Rishikesh",
        state: "Uttarakhand",
        coordinates: [78.2676, 30.0869]
    },

    {
        city: "Mussoorie",
        state: "Uttarakhand",
        coordinates: [78.0747, 30.4598]
    },

    {
        city: "Nainital",
        state: "Uttarakhand",
        coordinates: [79.4636, 29.3919]
    },

    {
        city: "Auli",
        state: "Uttarakhand",
        coordinates: [79.5690, 30.5285]
    },

    {
        city: "Munnar",
        state: "Kerala",
        coordinates: [77.0595, 10.0889]
    },

    {
        city: "Alleppey",
        state: "Kerala",
        coordinates: [76.3388, 9.4981]
    },

    {
        city: "Kochi",
        state: "Kerala",
        coordinates: [76.2673, 9.9312]
    },

    {
        city: "Ooty",
        state: "Tamil Nadu",
        coordinates: [76.6950, 11.4064]
    },

    {
        city: "Kodaikanal",
        state: "Tamil Nadu",
        coordinates: [77.4892, 10.2381]
    },

    {
        city: "Pondicherry",
        state: "Puducherry",
        coordinates: [79.8083, 11.9416]
    },

    {
        city: "Coorg",
        state: "Karnataka",
        coordinates: [75.8069, 12.3375]
    },

    {
        city: "Mysore",
        state: "Karnataka",
        coordinates: [76.6394, 12.2958]
    },

    {
        city: "Bangalore",
        state: "Karnataka",
        coordinates: [77.5946, 12.9716]
    },

    {
        city: "Hyderabad",
        state: "Telangana",
        coordinates: [78.4867, 17.3850]
    },

    {
        city: "Mumbai",
        state: "Maharashtra",
        coordinates: [72.8777, 19.0760]
    },

    {
        city: "Pune",
        state: "Maharashtra",
        coordinates: [73.8567, 18.5204]
    },

    {
        city: "Shillong",
        state: "Meghalaya",
        coordinates: [91.8933, 25.5788]
    },

    {
        city: "Guwahati",
        state: "Assam",
        coordinates: [91.7362, 26.1445]
    },

    {
        city: "Kaziranga",
        state: "Assam",
        coordinates: [93.1711, 26.5775]
    },

    {
        city: "Gangtok",
        state: "Sikkim",
        coordinates: [88.6065, 27.3389]
    },

    {
        city: "Darjeeling",
        state: "West Bengal",
        coordinates: [88.2636, 27.0410]
    }

];

function randomPlace() {

    return randomElement(places);

}

// ======================================================
// PROPERTY DETAILS
// ======================================================

function randomPrice() {

    return randomInt(1200, 18000);

}

function randomBedrooms() {

    return randomInt(1, 6);

}

function randomBathrooms() {

    return randomInt(1, 4);

}

function randomMaxGuests() {

    return randomInt(2, 12);

}
// ======================================================
// PROPERTY TITLE
// ======================================================

const titlePrefixes = [

    "Luxury",

    "Royal",

    "Premium",

    "Peaceful",

    "Modern",

    "Elegant",

    "Cozy",

    "Grand",

    "Scenic",

    "Exclusive",

    "Classic",

    "Beautiful"

];

const titleSuffixes = [

    "Retreat",

    "Stay",

    "Villa",

    "Resort",

    "Escape",

    "Residence",

    "Lodge",

    "Haven",

    "Suites",

    "Cabin",

    "Homestay",

    "Nest"

];

function generateTitle(type){

    return `${

        randomElement(titlePrefixes)

    } ${

        type

    } ${

        randomElement(titleSuffixes)

    }`;

}


// ======================================================
// DESCRIPTION
// ======================================================

const descriptionLines=[

"Experience comfort and luxury in one of the finest stays in the city.",

"Perfect for families, couples and business travellers.",

"Professionally cleaned before every stay.",

"Enjoy modern amenities with exceptional hospitality.",

"Located close to major tourist attractions.",

"Relax with peaceful surroundings and beautiful interiors.",

"Wake up to breathtaking views every morning.",

"A perfect blend of comfort and affordability.",

"Designed to provide a memorable vacation experience.",

"One of the highest-rated properties in the locality."

];

function generateDescription(){

    return `${

        randomElement(descriptionLines)

    } ${

        randomElement(descriptionLines)

    } ${

        randomElement(descriptionLines)

    }`;

}


// ======================================================
// REVIEW COMMENTS
// ======================================================

const reviewComments=[

"Amazing stay. Highly recommended.",

"Beautiful property with excellent service.",

"Very clean rooms and comfortable beds.",

"Loved the location and peaceful surroundings.",

"Host was extremely friendly and helpful.",

"Would definitely stay here again.",

"Worth every rupee spent.",

"Perfect for family vacations.",

"Food was delicious and freshly prepared.",

"Smooth check-in and check-out process.",

"Fantastic experience overall.",

"Property looked even better than the photos.",

"Highly recommended for couples.",

"Very spacious rooms.",

"Excellent cleanliness.",

"Safe neighbourhood.",

"Beautiful interiors.",

"Wonderful hospitality.",

"Great value for money.",

"Memorable stay."

];

function randomReview(){

    return randomElement(

        reviewComments

    );

}


// ======================================================
// BOOKING STATUS
// ======================================================

const bookingStatuses=[

"approved",

"approved",

"approved",

"approved",

"completed",

"completed",

"pending",

"pending",

"cancelled",

"rejected"

];

function randomBookingStatus(){

    return randomElement(

        bookingStatuses

    );

}

function getFolder(propertyType){

    if(propertyType==="Villa"){

        return Math.random()<0.5
            ?"beachVilla"
            :"luxuryVilla";

    }

    if(propertyType==="Other"){

        return Math.random()<0.5
            ?"lakeHouse"
            :"heritageHaveli";

    }

    return imageFolders[propertyType];

}
// ======================================================
// IMAGE FOLDERS
// ======================================================

const imageFolders={

Hotel:"luxuryHotel",

Resort:"resort",

Bungalow:"bungalow",

Apartment:"apartment",

Cabin:"mountainCabin",

Cottage:"cottage",

Glamping:"tent",

Hostel:"hostel",

Ryokan:"heritageHaveli",

Farmhouse:"farmhouse",

Boat:"lakeHouse",

Tent:"tent",

Villa:"luxuryVilla",

Other:"heritageHaveli"

};


// ======================================================
// GET IMAGES
// ======================================================
function getImages(propertyType) {

    const folder = getFolder(propertyType);

    const images = imageMap[folder];

    if (!images || images.length === 0) {

        return [];

    }

    return randomSubset(images, 6, 8);

}

// ======================================================
// EXPORTS
// ======================================================

module.exports={

randomInt,

randomFloat,

randomElement,

shuffle,

randomSubset,

propertyTypes,

listingTypes,

facilities,

places,

randomFacilities,

randomPlace,

randomPrice,

randomBedrooms,

randomBathrooms,

randomMaxGuests,

generateTitle,

generateDescription,

randomReview,

randomBookingStatus,

getImages,

getFolder

};