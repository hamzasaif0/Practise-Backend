import asyncHandler from '../utils/asyncHandler.js';
import ApiError from "../utils/ApiError.js";
import { User } from '../models/User.models.js';
import uploadfile from '../utils/cloudinary.js';
import ApiResponse from '../utils/APiresponse.js';
import jwt from "jsonwebtoken";
const genrateAccessandRefreshToken = async (userid)=>{
try{
const user = await User.findById(userid);
const accessToken = user.generateAccessToken();
const refreshtoken = user.generateRefreshToken(); 
user.refreshtoken = refreshtoken;
await user.save({validateBeforeSave : false});
return {refreshtoken,accessToken};

}
catch(error)
{
throw new ApiError(401 , "Something went wrong while generating access and refresh token");
}


}


const registercontol = asyncHandler(async(req , res)=>{
const {fullname,username , email,password}=req.body;

console.log("User-Name :",username ,"\n","Email :",email);

if([fullname,email,username,password].some((field)=>field?.trim() === "")){
throw new ApiError(400,'Something Fishy with your information',)
}
const existeduser = await User.findOne({$or : [{email},{username}]}) // $or humare pass aik se zyada values check karwane ke kam ata hai db se
if(existeduser){
throw new ApiError(409,"User already Exists");
}
const avatarlocalpath=req.files?.avatar[0]?.path;
// const coverimagelocalpath = req.files?.coverimage[0]?.path;
let coverimagelocalpath;
if(req.files && Array.isArray(req.files.coverimage) && req.files.coverimage.length> 0){
coverimagelocalpath = req.files.coverimage[0].path
}
// const coverimagelocalpath ="";
// // if(req.files?.coverimage[0]?.path){
// // coverimagelocalpath = req.files?.coverimage[0]?.path
// // }
if(!avatarlocalpath){
throw new ApiError(400,"The Image is not Uploaded ");
}
const avatar = await uploadfile(avatarlocalpath);
const coverimage = await uploadfile(coverimagelocalpath);
if(!avatar ){
throw new ApiError(400,"The Image is not Uploaded ");
}
const user = await User.create({
fullname,
username:username.toLowerCase(),
password,
email,
avatar:avatar.url,
coverimage:coverimage?.url || ""
})
const createduser = await User.findById(user._id).select(
"-password -refreshtoken"
)
if(!createduser){
throw new ApiError(500,"Something went wrong");
}
return res.status(201).json(
new ApiResponse(201,createduser,"User created sucessfully")
)
} )
const loginuser = asyncHandler(async(req,res)=>{

const {email , username , password} = req.body;
if(!email && !username){
throw new ApiError(400 , "Username or email is Required");
}
const data = await User.findOne({$or : [{email},{username}]});
if(!data){
throw new ApiError(404, "User does not exists");
}

const ispasswordvalid = await data.checkpassword(password)
if(!ispasswordvalid){
throw new ApiError(404, "Password is incorrect");
}
const {refreshtoken , accessToken} = await genrateAccessandRefreshToken(data._id);
const loggeduser = await User.findById(data._id).select("-password -refreshtoken");
const option = {
httpOnly : true,
secure : true
}
return res.status(200).cookie("Access",accessToken,option).cookie("Refresh",refreshtoken,option).json(
new ApiResponse(200 , {user: loggeduser , refreshtoken , accessToken},"Login Successfull")
);

});
const logoutuser = asyncHandler(async(req,res)=>{
await User.findByIdAndUpdate(req.user._id,
{
$set :{
refreshtoken : undefined
}
},
{
new : true
}
);
const option = {
httpOnly : true,
secure : true
}
return res.status(200).clearCookie("Access",option).clearCookie("Refresh",option).json(
new ApiResponse(200,"Logout Successful")
)

});
const refreshAccesstoken = asyncHandler(async(req , res)=>{
const token = req.cookies?.Refresh || req.body.refreshtoken;
if(!token){
    throw new ApiError(401 ,"Unauthorizes Request");
}
try {
    const decodejwt = jwt.verify(token,process.env.REFRESH_TOKEN);
    if(!decodejwt){
        throw new ApiError(400 , "Refreshtoken is Invalid");
    }
    const user = await User.findById(decodejwt._id);
    
    if(!user){
         throw new ApiError(401 ,"User invalid ");
    }
    if(token !== user.refreshtoken){
         throw new ApiError(401 ,"User token didnot match ");
    }
    
    const {refreshtoken , accessToken} = await genrateAccessandRefreshToken(decodejwt._id);
    const option = {
        httpOnly :true,
        secure:true
    }
    return res.status(200).cookie("Access",accessToken,option).cookie("Refresh",refreshtoken,option).json(
         new ApiResponse(200 , {refreshtoken},"Token refreshed Succsessfully" )
    )
    
    
} catch (error) {
    throw new ApiError(401 , error?.message || "Invalid token");
}

})

export {registercontol , loginuser , logoutuser , refreshAccesstoken};