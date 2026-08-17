import{ CaretakerProfile }from "../models/careTakerProfiles.models.js";
import { User } from "../models/users.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { geocodeAddress } from "../utils/geocodeAddress.js";

const createAdvertisement = asyncHandler(async (req, res) => {

  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  const { careType, about, experienceYears, address, pincode, city, state, availability, isCurrentlyAvailable } = req.body;

  const existingProfile = await CaretakerProfile.findOne({ user: user._id });

  if (existingProfile) {
    throw new ApiError(409, "You already have a caretaker advertisement created.");
  }

   if (!req.file) {
  throw new ApiError(400, "Profile photo is required.");
   }

  let photo =  null;
  
    if (req.file.size > 5 * 1024 * 1024) {
    throw new ApiError(
      400,
      "Profile photo must be less than 5MB."
    );
  }

  if (!req.file.mimetype.startsWith("image/")) {
    throw new ApiError(
      400,
      "Only image files are allowed."
    );
  }
     
    const uploadedImage = await uploadOnCloudinary(req.file.path);
        
    if (!uploadedImage) {
      throw new ApiError(500, "Could not upload the profile picture. Please try again.");
    }

    photo = {
      url: uploadedImage.secure_url,
      publicId: uploadedImage.public_id,
    };
  

  const { lat, lng } = await geocodeAddress({ city, state, pincode });

  const caretakerProfile = await CaretakerProfile.create({
    user: user._id,
    careType,
    photo,
    about: about || "",
    experienceYears: Number(experienceYears || 0),
    address,
    pincode,
    city,
    state,
    location: {
      type: "Point",
      coordinates: [lng, lat],
    },
    availability: availability || [],
    isCurrentlyAvailable: isCurrentlyAvailable ?? true,
    status: "active",
  });

  user.isCaretaker = true;
  user.caretakerProfile = caretakerProfile._id;
  await user.save({ validateBeforeSave: false });

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        profile: caretakerProfile,
      },
      "Caretaker advertisement created successfully."
    )
  );
});

export { createAdvertisement };