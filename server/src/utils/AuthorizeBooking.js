import { Booking } from "../models/bookings.models.js";
import { CaretakerProfile } from "../models/careTakerProfiles.models.js";
import { ApiError } from "./ApiError.js";

async function findAuthorizedBooking(bookingId, userId) {
    const caretaker = await CaretakerProfile.findOne({
        user: userId,
    });

    if (!caretaker) {
        throw new ApiError(404, "Caretaker profile not found.");
    }

    const booking = await Booking.findOne({
        _id: bookingId,
        caretaker: caretaker._id,
    });

    if (!booking) {
        throw new ApiError(404, "Booking not found.");
    }

    return booking;
}

export { findAuthorizedBooking };