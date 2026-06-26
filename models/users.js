const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({

    // ===========================
    // BASIC DETAILS
    // ===========================

    fullName: {
        type: String,
        required: true,
        trim: true
    },

    username: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        unique: true,
        validate: {
            validator: (value) =>
                value !== "null" && value !== "undefined",
            message: "Username cannot be null."
        }
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    // ===========================
    // PROFILE IMAGE
    // ===========================

    profileImage: {

        url: {
            type: String,
            default: ""
        },

        filename: {
            type: String,
            default: ""
        }

    },

    // ===========================
    // EMAIL VERIFICATION
    // ===========================

    isVerified: {
        type: Boolean,
        default: false
    },

    verificationToken: {
        type: String,
        default: ""
    },

    verificationTokenExpires: {
        type: Date
    },

    // ===========================
    // PASSWORD RESET
    // ===========================

    resetPasswordToken: {
        type: String,
        default: ""
    },

    resetPasswordExpires: {
        type: Date
    },

    // ===========================
    // USER ROLE
    // ===========================

    role: {
        type: String,
        enum: ["guest", "host", "admin"],
        default: "guest"
    },

    // ===========================
    // WISHLIST
    // ===========================

    wishlist: [
        {
            type: Schema.Types.ObjectId,
            ref: "Listing"
        }
    ],
    // ===========================
    // ACCOUNT INFO
    // ===========================
    createdAt: {
        type: Date,
        default: Date.now
    }
});

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", userSchema);