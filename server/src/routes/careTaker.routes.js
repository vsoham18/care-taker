import { Router } from "express";
import { createAdvertisement } from "../controllers/advertisement.controllers.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createCaretakerProfileSchema } from "../validator/careTaker.validator.js";
import { upload } from "../middlewares/multer.middleware.js";
import { parseFormData } from "../middlewares/parseformData.middleware.js";

const router = Router();

router
.route("/advertise")
.post(
    verifyJwt,
    upload.single("profilePicture"),
    parseFormData,
    validate(createCaretakerProfileSchema),
     createAdvertisement
    );

export default router;