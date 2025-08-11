import ApiResponse from "../utils/APiresponse";
import asyncHandler from "../utils/asyncHandler";

const checkHealth = asyncHandler(async(req , res)=>{

return res.status(200).json(new ApiResponse(200,"Every thing is going fine"));


})