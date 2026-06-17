const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email:{
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        validate: {
            validator: (value) => value !== "null" && value !== "undefined",
            message: "Username cannot be null.",
        },
    },
    profileImage: {
        url: String,
        filename: String
    },
    role: {
        type: String,
        enum: ["guest","host","admin"],
        default: "guest"
    },
    wishlist: [{
        type: Schema.Types.ObjectId,
        ref: "Listing"
    }]
});

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User",userSchema);