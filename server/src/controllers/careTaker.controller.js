import mongoose from "mongoose";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/users.models.js";
import { CaretakerProfile } from "../models/careTakerProfiles.models.js";
import { geocodeAddress } from "../utils/geocodeAddress.js";

const escapeRegExp = (value = "") => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const listCaretakerProfiles = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(12, Math.max(1, Number(req.query.limit) || 12));
  const skip = (page - 1) * limit;

  const lat = Number(req.query.lat);
  const lng = Number(req.query.lng);

  const hasLocation =
    Number.isFinite(lat) && Number.isFinite(lng);

    
  const matchQuery = { status: "active" };
  if (req.query.city) {
    matchQuery.city = new RegExp(`^${escapeRegExp(req.query.city.trim())}$`, "i");
  }
  if (req.query.state) {
    matchQuery.state = new RegExp(`^${escapeRegExp(req.query.state.trim())}$`, "i");
  }
  if (req.query.pincode) {
    matchQuery.pincode = req.query.pincode.trim();
  }

  if (req.query.careType) {
    matchQuery.careType = req.query.careType;
  }

  const pipeline = hasLocation
    ? [
        {
          $geoNear: {
            near: {
              type: "Point",
              coordinates: [lng, lat],
            },
            distanceField: "distance",
            spherical: true,
            query: matchQuery,
          },
        },
        {
          $addFields: {
            distanceKm: {
              $round: [
                {
                  $divide: ["$distance", 1000],
                },
                2,
              ],
            },
          },
        },
        {
          $sort: {
            distance: 1,
            ratingAvg: -1,
            createdAt: -1,
          },
        },
      ]
    : [
        {
          $match: matchQuery,
        },
        {
          $sort: {
            ratingAvg: -1,
            createdAt: -1,
          },
        },
      ];

  pipeline.push(
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
        pipeline: [
          {
            $project: {
              name: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: "$user",
    },
    {
      $project: {
        photo: 1,
        careType: 1,
        city: 1,
        pincode: 1,
        ratingAvg: 1,
        ratingCount: 1,
        isCurrentlyAvailable: 1,
        distanceKm: 1,

        "user._id": 1,
        "user.name": 1,
      },
    },
    {
      $skip: skip,
    },
    {
      $limit: limit,
    }
  );

  const [profiles, total] = await Promise.all([
    CaretakerProfile.aggregate(pipeline),
    CaretakerProfile.countDocuments(matchQuery),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        profiles,
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page < Math.ceil(total / limit),
      },
      "Caretakers fetched successfully."
    )
  );
});

const getCaretakerProfile = asyncHandler(async (req, res) => {
   const id = req.params.id

   if (!mongoose.isValidObjectId(id)) {
        throw new ApiError(400, "Invalid caretaker profile id.");
    }

   const profile = await CaretakerProfile.aggregate([
     { 
      $match: { 
        _id: new mongoose.Types.ObjectId(id) 
      } 
    },
    {
       $lookup: {
         from: "users",
         localField: "user",
         foreignField: "_id",
         as: "userDetails",
         pipeline: [
           {
             $project: {
               name: 1
             }
           }
         ]
       }
    },
     {
      $unwind: "$userDetails"
    },
    {
      $project: {
    location: 0,
    createdAt: 0,
    updatedAt: 0,
    __v: 0
  }
    }
   ])
    
   if (!profile.length) {
        throw new ApiError(404, "Caretaker profile not found.");
    }

  return res.status(200).json(new ApiResponse(200, profile[0], "Caretaker profile fetched successfully."));
});

const getMyCaretakerProfile = asyncHandler(async (req, res) => {
    const id = req.user.caretakerProfile;

   if(!id) {
    throw new ApiError(404, "You do not have a caretaker profile yet.");
  }

  const profile = await CaretakerProfile.findById(id).select("-createdAt -updatedAt -location -__v");


  return res.status(200).json(new ApiResponse(200, profile, "Your caretaker profile fetched successfully."));
}); 

const updateMyCaretakerProfile = asyncHandler(async (req, res) => {
  const id = req.user.caretakerProfile;

  const existingProfile = await CaretakerProfile.findById(id);

    if (!existingProfile) {
        throw new ApiError(404, "Caretaker profile not found.");
    }

  const updates = {};
  const allowedFields = [
        "careType",
        "about",
        "experienceYears",
        "address",
        "city",
        "state",
        "pincode",
        "availability",
        "isCurrentlyAvailable",
        "status",
    ];
   
  for (const field of allowedFields) {
        if (req.body[field] !== undefined) {
            updates[field] = req.body[field];
        }
    }

  if (updates.city || updates.state || updates.pincode) {

    const geocoded = await geocodeAddress({
      city: updates.city ?? existingProfile.city,
      state: updates.state ?? existingProfile.state,
      pincode: updates.pincode ?? existingProfile.pincode,
    });

    updates.location = {
      type: "Point",
      coordinates: [geocoded.lng, geocoded.lat],
    };
  }
   
   if (req.file?.path) {

        const uploadedPhoto =
            await uploadOnCloudinary(req.file.path);

        if (!uploadedPhoto) {
            throw new ApiError(
                500,
                "Failed to upload profile photo."
            );
        }

        // Delete previous photo
        if (existingProfile.photo?.publicId) {
            await deleteFromCloudinary(
                existingProfile.photo.publicId
            );
        }

        updates.photo = {
            url: uploadedPhoto.secure_url,
            publicId: uploadedPhoto.public_id,
        };
    }

  const updatedProfile = await CaretakerProfile.findByIdAndUpdate(
  id,
  {
    $set: updates,
  },
  {
    new: true,
    runValidators: true,
  }
).select("-location -createdAt -updatedAt -__v");
 
  return res.status(200).json(
        new ApiResponse(
            200,
            updatedProfile,
            "Caretaker profile updated successfully."
        )
    );
});

export {
  listCaretakerProfiles,
  getCaretakerProfile,
  getMyCaretakerProfile,
  updateMyCaretakerProfile,
};