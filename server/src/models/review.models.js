import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({

    booking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking",
        required: true,
    },

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

    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true,
    },

    comment: {
        type: String,
        trim: true,
        maxlength: 1000,
        default: "",
    },
}, {
    timestamps: true,
});

export const Review = mongoose.model("Review",reviewSchema )