if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
app.use(express.static(path.join(__dirname,"/public")));
const ExpressError = require("./utils/ExpressError.js");
const dbUrl = process.env.ATLASDB_URL;
const Review = require("./models/reviews.js"); 
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const listings = require("./routes/listings.js");
const reviews = require("./routes/reviews.js");
const user = require("./routes/user.js");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/users.js");
const { log } = require("console");

main()
    .then(() => {
        console.log("Db connected");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(dbUrl);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter: 24*3600,
});

store.on("error", ()=> {
    console.log("ERROR in MONGO SESSION STORE",err);
});

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave:false,
    saveUninitialized: true,
    cookie :{
        expires: Date.now() + 7*24*60*60*1000,
        maxAge:   7*24*60*60*1000,
        httpOnly: true,
    },
};
app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

app.use('/listings',listings);
app.use('/listings/:id/reviews',reviews);
app.use('/',user);

app.get('/', (req, res) => {
    res.redirect('/listings'); // Redirects the root URL to /listings
});
app.all('/{*any}', (req, res, next) => {
    next(new ExpressError(404, 'Page Not Found!'));
});

app.listen(8080, () => {
    console.log("App is listening to port 8080");
});

