import { Router } from "express";
import { acceptBooking, cancelBooking, completeBooking, getMyBookings, getRequestedBookings, rejectBooking, requestBooking } from "../controllers/booking.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createBookingSchema } from "../validator/booking.validator.js";

const router = Router();

router.route("/request/:caretakerId").post(verifyJwt,validate(createBookingSchema),requestBooking);

router.route("/my-bookings").get(verifyJwt,getMyBookings);
router.route("/requested-bookings").get(verifyJwt,getRequestedBookings);

router.route("/accept/:bookingId").patch(verifyJwt,acceptBooking);
router.route("/reject/:bookingId").patch(verifyJwt,rejectBooking);
router.route("/cancel/:bookingId").patch(verifyJwt,cancelBooking);
router.route("/complete/:bookingId").patch(verifyJwt,completeBooking);

export default router;