import { Router } from "express";
import { createOTP, verifyOTP } from "../controllers/otp.controllers.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/send").post(verifyJwt, createOTP);
router.route("/verify").post(verifyJwt, verifyOTP);

export default router;