import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    caretaker: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CaretakerProfile",
        required: true,
    },

    servicePeriod: {
        from: {
            type: Date,
            required: true,
        },
        to: {
            type: Date,
            required: true,
        },
    },

    preferredTime: {
        type: String,
        default: "",
    },

    message: {
        type: String,
        maxlength: 500,
        default: "",
    },

    status: {
        type: String,
        enum: [
            "pending",
            "accepted",
            "rejected",
            "completed",
            "cancelled",
        ],
        default: "pending",
    },

    acceptedAt: {
      type: Date,
     default: null,
    },

     completedAt: {
        type: Date,
       default: null,
    },

    isRatable: {
        type: Boolean,
        default: false,
    },

    hasBeenRated: {
        type: Boolean,
        default: false,
    }

}, { timestamps: true });

export const Booking = mongoose.model("Booking", bookingSchema);