import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import  Jwt from "jsonwebtoken";
import { User } from "../models/User.models.js";
export const verifyjwt = asyncHandler(async(req , res , next)=>{
 try {
      
   const token = req.cookies?.Access || req.header(
       "Authorization")?.replace("Bearer ","");
   if(!token){
       throw new ApiError(401 , "Unauthorized");
   }
   const decodedjwt = Jwt.verify(token , process.env.ACCESS_TOKEN);
   const user = await User.findById(decodedjwt?._id).select("-password -refreshtoken")
   
   if(!user){
       throw new ApiError(401 , "Invalid Access Token");
   }
   req.user = user;
   next();
 } catch (error) {
    throw new ApiError(401 , "Unauthorized Error");
 }

})