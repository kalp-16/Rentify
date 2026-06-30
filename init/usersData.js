const User = require("../models/users");

// ==========================================
// FIRST NAMES
// ==========================================

const firstNames = [

    "Aarav","Vivaan","Aditya","Arjun","Krishna",
    "Rahul","Rohan","Aryan","Yash","Karan",
    "Ishaan","Abhishek","Aman","Akash","Harsh",
    "Aniket","Sourav","Nikhil","Parth","Ritik",
    "Aditi","Ananya","Sneha","Priya","Kavya",
    "Pooja","Neha","Riya","Meera","Diya",
    "Sakshi","Nandini","Ishita","Simran","Shruti"

];

// ==========================================
// LAST NAMES
// ==========================================

const lastNames = [

    "Sharma","Patel","Gupta","Verma","Singh",
    "Yadav","Das","Reddy","Shah","Nair",
    "Jain","Joshi","Kapoor","Mehta","Bose",
    "Kulkarni","Chauhan","Trivedi","Malhotra","Mishra",
    "Pandey","Roy","Saxena","Agarwal","Bhatt",
    "Desai","Iyer","Kaushik","Menon","Chopra"

];

// ==========================================
// RANDOM
// ==========================================

function randomElement(array){

    return array[
        Math.floor(
            Math.random()*array.length
        )
    ];

}

// ==========================================
// RANDOM USER IMAGE
// ==========================================

function randomProfileImage(){

    const gender =

        Math.random()<0.5

        ? "men"

        : "women";

    const number =

        Math.floor(

            Math.random()*100

        );

    return{

        url:

`https://randomuser.me/api/portraits/${gender}/${number}.jpg`,

        filename:""

    };

}

// ==========================================
// GENERATE USERS
// ==========================================

async function generateUsers(){

    console.log("\nCreating Users...\n");

    await User.deleteMany({});

    const users=[];

    const usedUsernames=new Set();

    const usedEmails=new Set();

    for(let i=0;i<35;i++){

        let firstName=

        randomElement(firstNames);

        let lastName=

        randomElement(lastNames);

        let username=

`${firstName.toLowerCase()}_${lastName.toLowerCase()}_${i+1}`;

        while(

            usedUsernames.has(username)

        ){

            username=

`${firstName.toLowerCase()}_${lastName.toLowerCase()}_${Math.floor(Math.random()*9999)}`;

        }

        usedUsernames.add(username);

        let email=

`${username}@gmail.com`;

        while(

            usedEmails.has(email)

        ){

            email=

`${username}${Math.floor(Math.random()*100)}@gmail.com`;

        }

        usedEmails.add(email);

        let role="guest";

        if(i===0){

            role="admin";

        }

        else if(i<16){

            role="host";

        }

        const newUser=new User({

            fullName:

`${firstName} ${lastName}`,

            username,

            email,

            role,

            profileImage:

            randomProfileImage(),

            isVerified:true,

            wishlist:[],

            verificationToken:"",

            resetPasswordToken:""

        });

        const registeredUser=

        await User.register(

            newUser,

            "Rentify@123"

        );

        users.push(

            registeredUser

        );

    }

    console.log(

`${users.length} Users Created`

    );

    return{

        admin:

users.find(

user=>user.role==="admin"

),

        hosts:

users.filter(

user=>user.role==="host"

),

        guests:

users.filter(

user=>user.role==="guest"

),

        users

    };

}

module.exports=generateUsers;