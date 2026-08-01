import bcrypt from "bcryptjs";
import { OTP } from "../models/otp.models.js";
import { User } from "../models/users.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

const OTP_TTL_MINUTES = 5;

const normalizePhone = (phone) => String(phone || "").replace(/\D/g, "");

const buildOtpExpiration = () =>
  new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);

const generateOTP = () =>
  String(Math.floor(100000 + Math.random() * 900000));

export const createOTP = asyncHandler(async (req, res) => {
  const { phone, purpose = "advertisement" } = req.body;

  if (!phone) {
    throw new ApiError(400, "Phone number is required.");
  }

  const normalizedPhone = normalizePhone(phone);
  const otp = generateOTP();
  const otpHash = await bcrypt.hash(otp, 10);

  await OTP.deleteMany({ phone: normalizedPhone, purpose });

  await OTP.create({
    phone: normalizedPhone,
    otp: otpHash,
    purpose,
    attempts: 0,
    expiresAt: buildOtpExpiration(),
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        phone: normalizedPhone,
        purpose,
        expiresInMinutes: OTP_TTL_MINUTES,
        otp: process.env.NODE_ENV !== "production" ? otp : undefined,
      },
      "OTP sent successfully."
    )
  );
});

export const verifyOTP = asyncHandler(async (req, res) => {
  const { phone, otp, purpose = "advertisement" } = req.body;

  if (!phone || !otp) {
    throw new ApiError(400, "Phone number and OTP are required.");
  }

  const normalizedPhone = normalizePhone(phone);
  const otpRecord = await OTP.findOne({ phone: normalizedPhone, purpose }).sort({
    createdAt: -1,
  });
   

  if (!otpRecord) {
    throw new ApiError(404, "No OTP request found for this phone number.");
  }
   
if (otpRecord.attempts >= 5) {
    await OTP.deleteOne({ _id: otpRecord._id });
    throw new ApiError(401, "Too many failed attempts. Please request a new OTP.");
  }

  if (otpRecord.expiresAt < new Date()) {
    throw new ApiError(400, "OTP has expired. Please request a new one.");
  }
  
  const isValidOTP = await bcrypt.compare(otp, otpRecord.otp);
   
  if (!isValidOTP) {
    otpRecord.attempts += 1;
    await otpRecord.save({ validateBeforeSave: false });
    throw new ApiError(400, "Invalid OTP. Please try again.");
  }

  await OTP.deleteOne({ _id: otpRecord._id });

  const existingUser = await User.findOne({
    phone: normalizedPhone,
    _id: { $ne: req.user?._id },
  });

  if (existingUser) {
    throw new ApiError(409, "This phone number is already associated with another account.");
  }

  req.user.phone = normalizedPhone;
  req.user.phoneVerified = true;
  await req.user.save({ validateBeforeSave: false });

  return res.status(200).json(
    new ApiResponse(
      200,
      { phoneVerified: true, phone: normalizedPhone },
      "Phone number verified successfully."
    )
  );
});