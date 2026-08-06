import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { createReviewSchema } from "../validator/review.validator.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createReview, getReview } from "../controllers/review.controller.js";

const router = Router() ;

router.route("/create/:bookingId").post(verifyJwt,validate(createReviewSchema),createReview)
router.route("/:caretakerId").get(verifyJwt,getReview)


export default router ;