import jwt from "jsonwebtoken";

export const generateMobileVerificationToken = (phone) => {
  return jwt.sign(
    {
      phone,
      type: "mobile-verification",
    },
    process.env.MOBILE_VERIFICATION_SECRET,
    {
      expiresIn: process.env.MOBILE_VERIFICATION_TOKEN_EXPIRY || "10m",
    }
  ); 
};

export const verifyMobileVerificationToken = (token) => {
  return jwt.verify(
    token,
    process.env.MOBILE_VERIFICATION_SECRET
  );
};