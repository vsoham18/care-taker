import { Router } from "express";
import { validate } from "../middlewares/validate.middleware.js";
import { loginSchema, registerSchema } from "../validator/auth.validator.js";
import { registerUser, loginUser, logoutUser, getProfile } from "../controllers/user.controllers.js";
import { ro } from "zod/v4/locales";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(validate(registerSchema),registerUser)
router.route("/login").post(validate(loginSchema),loginUser) 

// protected route 
router.route("/logout").post(verifyJwt, logoutUser)
router.route("/me").get(verifyJwt, getProfile)


export default router;