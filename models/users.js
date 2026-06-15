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
});

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User",userSchema);