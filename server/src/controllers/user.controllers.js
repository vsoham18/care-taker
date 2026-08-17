import { asyncHandler } from "../utils/AsyncHandler.js";
import { User } from "../models/users.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { geocodeAddress } from "../utils/geocodeAddress.js";
import { verifyMobileVerificationToken } from "../utils/MobileVerificationToken.js";
import jwt from "jsonwebtoken";


const generateAcessAndRefreshToken = (async (userId) => {
      try{
      const user = await User.findById(userId)
      const accessToken = user.generateAccessToken()
      const refreshToken = user.generateRefreshToken()
      
      user.refreshToken = refreshToken
     await user.save({ validateBeforeSave:false })
       
      return { accessToken, refreshToken }
  }catch(err){
     throw new ApiError (500, err.message || "something went wrong while generating acess and refresh token")
  }
})

const options = {
     httpOnly : true,
     secure : true     
}

export const registerUser = asyncHandler(async (req, res) => {
      const {
        name,
        email,
        password,
        phone,
    } = req.body;

// const mobileVerificationToken = req.cookies.mobileVerificationToken;

//     if (!mobileVerificationToken) {
//         throw new ApiError(
//             400,
//             "Mobile verification required."
//         );
//     } 
     
    // const decodedToken = verifyMobileVerificationToken(mobileVerificationToken)

    // if (!decodedToken) {
    //     throw new ApiError(
    //         400,
    //         "Mobile verification expired. Please request a new OTP."
    //     );
    // }
     
    //  if (decodedToken.phone !== phone) {
    //     throw new ApiError(
    //         400,
    //         "Phone number mismatch."
    //     );
    // }


  const exists = await User.findOne({ 
    $or: [{ email }, { phone }],
  });

  if (exists) {
    throw new ApiError(409, "An account with this email or phone already exists.");
  }

  const user = await User.create({
    name,
    email,
    password,
    phone, 
  });
  // phoneVerified: true,

  const {accessToken, refreshToken} = await generateAcessAndRefreshToken(user._id)

   const createdUser = await User.findById(user._id).select(
      "-password -refreshToken",
    )
    if(!createdUser) throw new ApiError(500, "something went wrong while registering")
    
    
   return res.status(200)
  .cookie("accessToken",accessToken,options)
  .cookie("refreshToken", refreshToken, options)
  .json(
    new ApiResponse(
      200, {
        user : createdUser, accessToken, refreshToken
      },
      "Join Successfully"
    )
  )
});

export const loginUser = asyncHandler ( async (req, res) => {
     const { email, password} = req.body 

     const user = await User.findOne({email})
     if(!user) throw new ApiError(404, "user not found with this email")
     
    if (!await user.isPasswordsCorrect(password)) throw new ApiError(400, "incorrect password")
 
 const {accessToken, refreshToken} = await generateAcessAndRefreshToken(user._id)
  
 const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

  return res.status(200)
  .cookie("accessToken",accessToken,options)
  .cookie("refreshToken", refreshToken, options)
  .json(
    new ApiResponse(
      200, {
        user : loggedInUser, accessToken, refreshToken
      },
      "User logged in Successfully"
    )
  )
})

export const logoutUser = asyncHandler(async (req, res) => {
  const result = await User.updateOne(
  { _id: req.user._id },
  {
    $unset: {
      refreshToken: 1
    }
  }
)
 
  return res
  .status(200)
  .clearCookie("accessToken",options)
  .clearCookie("refreshToken",options)
  .json( new ApiResponse(200,{}, "user logged Out") )

} )

export const refreshAccessToken = asyncHandler( async(req,res) =>{
    const incomingToken = req.cookies?.refreshToken || req.body?.refreshToken 
    
    if(!incomingToken) throw new ApiError (400, "Unauthorised request") 
    
    try {
      const decodedToken = jwt.verify(incomingToken,process.env.REFRESH_TOKEN_SECRET) 
  
       const user = await User.findById(decodedToken._id)
       if(!user) throw new ApiError(400, "Invalid refresh token") 
  
       if(incomingToken != user.refreshToken)  throw new ApiError(400,"Refresh token is expired and or invalid") 
  
        const {accessToken, refreshToken} = await generateAcessAndRefreshToken(user._id)
       
  
      return res.status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken", refreshToken, options)
    .json (new ApiResponse(
      200,
      {
            accessToken,
            refreshToken,
      },
     "new token generated"
     ))
    } catch (error) {
        throw new ApiError(500, error?.message || "invalid refresh Token")
    }
        
})

export const getProfile = asyncHandler(async (req, res) => {
   const user = await User.findById(req.user._id).select("-password -refreshToken")
   return res.status(200)
   .json(new ApiResponse(200, { user }, "Profile fetched successfully"))
})
