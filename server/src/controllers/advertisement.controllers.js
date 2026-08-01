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

  if (!user.phoneVerified) {
    throw new ApiError(
      400, 
      "Please verify your mobile number before submitting the caretaker advertisement."
    );
  }

  const { phone, careType, about, experienceYears, address, pincode, city, state, availability, isCurrentlyAvailable } = req.body;

  if (phone && user.phone && phone !== user.phone) {
    throw new ApiError(400, "Please use the verified mobile number for the advertisement.");
  }

  if (!careType?.length || !address || !pincode || !city || !state) {
    throw new ApiError(400, "Please provide complete caretaker profile details.");
  }

  const existingProfile = await CaretakerProfile.findOne({ user: user._id });

  if (existingProfile) {
    throw new ApiError(409, "You already have a caretaker advertisement created.");
  }

  let photo =  null;

  if (req.file?.path) {
    const uploadedImage = await uploadOnCloudinary(req.file.path);

    if (!uploadedImage) {
      throw new ApiError(500, "Could not upload the profile picture. Please try again.");
    }

    photo = {
      url: uploadedImage.secure_url,
      publicId: uploadedImage.public_id,
    };
  }

  if (!photo?.url || !photo?.publicId) {
    throw new ApiError(400, "Profile picture is required to create the advertisement.");
  }

  const { lat, lng } = await geocodeAddress({ city, state, pincode });

  const caretakerProfile = await CaretakerProfile.create({
    user: user._id,
    careType,
    photo,
    about: about || "",
    experienceYears: Number(experienceYears || 0),
    phone: user.phone,
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
        phoneVerified: user.phoneVerified,
        phone: user.phone,
      },
      "Caretaker advertisement created successfully."
    )
  );
});

export { createAdvertisement };