import { User } from "../models/users.models.js";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

const verifyJwt = asyncHandler(async(req, res,next)=>{
      try {
      
         const token = req.cookies?.accessToken || req.header("authorization")?.replace("Bearer","")
         
         if(!token) throw new ApiError(401, "Unoauthorised request")
        
         const decodedToken = await jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
          
         const user = await User.findById(decodedToken._id).select("-password -refreshToken")
  
         if(!user) throw new ApiError(401, "Invalid token access")
  
          req.user = user 
           next() 
      }
      catch (error) {
         throw new ApiError(400,error?.message || "invalid access Token")
      }   
})

export { verifyJwt }