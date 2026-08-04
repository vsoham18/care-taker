import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
 {
    phone: {
      type: String,
      required: true,
    },

    otp: {
      type: String,
      required: true,
    },
      attempts: {
      type: Number,
      default: 0,
    },
    verified: {
      type: Boolean,
      default: false,
    },

    expiresAt: {
      type: Date,
      required: true,
    },
  },
{
timestamps:true
});

otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const OTP = mongoose.model("OTP",otpSchema);