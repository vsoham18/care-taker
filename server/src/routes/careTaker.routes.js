import { Router } from "express";
import { createAdvertisement } from "../controllers/advertisement.controllers.js";
import {
  listCaretakerProfiles,
  getCaretakerProfile,
  getMyCaretakerProfile,
  updateMyCaretakerProfile,
} from "../controllers/careTaker.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createCaretakerProfileSchema, updateCaretakerProfileSchema } from "../validator/careTaker.validator.js";
import { upload } from "../middlewares/multer.middleware.js";
import { parseFormData } from "../middlewares/parseformData.middleware.js";

const router = Router();

router.route("/").get( listCaretakerProfiles );
router.route("/:id").get( getCaretakerProfile );
router.route("/me/profile").get(verifyJwt, getMyCaretakerProfile);

router.route("/advertise").post(verifyJwt, upload.single("profilePicture"), parseFormData, validate(createCaretakerProfileSchema), createAdvertisement);
router.route("/me/profile").patch(verifyJwt, upload.single("profilePicture"), parseFormData, validate(updateCaretakerProfileSchema), updateMyCaretakerProfile);

export default router; 