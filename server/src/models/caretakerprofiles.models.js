import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2" 

const caretakerProfileSchema = new mongoose.Schema(
 {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    careType: {
      type: [String],   
      enum: ["Both","elderly-care", "baby-care"],
      required: true,
    },

    photo: {
      url: { type: String, required: true },
      publicId: { type: String, required: true },
    },

    about: {
       type: String,
       maxlength: 1000, 
       default: "" 
      },

    experienceYears: {
       type: Number,
        default: 0 
      },
 
    address: { 
      type: String, 
      required: true 
    }, 

    pincode: {
       type: String, 
       required: true
       },

    city: { 
      type: String, 
      required: true
     },

    state: {
       type: String, 
       required: true 
      },

    location: {
       type: { 
        type: String, 
        enum: ["Point"], 
        default: "Point" 
      },
      coordinates: {
         type: [Number], 
         default: [0, 0] 
        },
    },

    isCurrentlyAvailable: {
       type: Boolean, 
       default: true 
      },

    ratingAvg: {
       type: Number, 
       default: 0 
      },

    ratingCount: {
       type: Number, 
       default: 0 
      },

    status: {
      type: String,
      enum: ["active", "paused"],
      default: "active",
    },
  },
  { timestamps: true }
);

caretakerProfileSchema.index({ location: "2dsphere" });
caretakerProfileSchema.index({ city: 1, pincode: 1 , careType: 1 });
caretakerProfileSchema.plugin(mongooseAggregatePaginate);

export const CaretakerProfile = mongoose.model("CaretakerProfile", caretakerProfileSchema);
