const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingSchema = new Schema(
{
    property: {
        type: Schema.Types.ObjectId,
        ref: "Listing",
        required: true,
    },

    guest: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    host: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    guestName: {
        type: String,
        required: true,
        trim: true,
    },

    guestEmail: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },

    checkIn: {
        type: Date,
        required: true,
    },

    checkOut: {
        type: Date,
        required: true,
        validate: {
            validator: function (value) {
                return value > this.checkIn;
            },
            message: "Check-out date must be after check-in date.",
        },
    },

    guests: {
        type: Number,
        required: true,
        min: 1,
    },

    totalPrice: {
        type: Number,
        required: true,
        min: 0,
    },

    bookingMode: {
        type: String,
        enum: ["auto", "manual"],
        required: true,
    },

    status: {
        type: String,
        enum: [
            "pending",
            "approved",
            "rejected",
            "cancelled",
            "completed",
        ],
        default: "pending",
    },

    paymentStatus: {
        type: String,
        enum: [
            "pending",
            "paid",
            "refunded",
        ],
        default: "pending",
    },

    specialRequests: {
        type: String,
        default: "",
        trim: true,
    },

    cancellationReason: {
        type: String,
        default: "",
        trim: true,
    },

    reviewSubmitted: {
        type: Boolean,
        default: false,
    },

    bookingDate: {
        type: Date,
        default: Date.now,
    },
},
{
    timestamps: true,
}
);

// Indexes for faster queries
bookingSchema.index({ guest: 1 });
bookingSchema.index({ host: 1 });
bookingSchema.index({ property: 1 });
bookingSchema.index({ status: 1 });

module.exports = mongoose.model("Booking", bookingSchema);