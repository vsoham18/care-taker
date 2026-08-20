import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createReportSchema } from "../validator/report.validator.js";
import { reportCaretakerProfile, reportReview } from "../controllers/report.controller.js";

const router = Router();

router.route("/caretaker/:caretakerId").post(verifyJwt,validate(createReportSchema),reportCaretakerProfile)
router.route("/review/:reviewId").post(verifyJwt,validate(createReportSchema),reportReview)
 
export default router ; 