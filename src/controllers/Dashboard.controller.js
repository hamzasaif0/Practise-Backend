import { Like } from "../models/Like.models.js";
import { User } from "../models/User.models.js";
import { Video } from "../models/Vedios.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import  ApiError  from "../utils/ApiError.js";
import  ApiResponse from "../utils/APiresponse.js";

const getChannelStats = asyncHandler(async (req, res) => {

    const {channelusername} = req.params;
    if (!channelusername) {
        throw new ApiError(400, "Channel username is required");
    }
    const user = await User.findOne({username:channelusername}).select("-password -refreshtoken ");
    if (!user) {
        throw new ApiError(404, "User not found");
    }
     const list =   await Subscription.aggregate([
            {
                $match: { channel: user._id }
            },
            {
                $lookup:{
                    from: "users",
                    localField: "subscriber",
                    foreignField: "_id",
                    as: "subscribers"
                }
            },
            {
                $project: {
                    _id: 1,
                    channel: 1,
                    subscriberCount: { $size: "$subscribers" }
                }
            }]);
    const vediodetail  = await Video.aggregate([
        {
            $match: { owner: user._id }
        },
        {
           $group: {
            _id: null,
            totalviews: { $sum: "$views" }
           }
        }
    ]);
    const totalviews = vediodetail.length > 0 ? vediodetail[0].totalviews : 0;
    const totalSubscribers = list.length > 0 ? list[0].subscriberCount : 0;
    const video = await Video.aggregate([
        {
            $match: { owner: user._id }
        },
    ]);
    const totalVideos = video.length;
  const likesonvideo = await Video.find({owner:user._id});    
  const videoids = likesonvideo.map(v=>v._id);
  const totallikes = await Like.countDocuments({video : {$in:videoids}})  ;      
const detail={
    totalSubscribers,
    totalviews,
    totalVideos,
    totallikes,
}
  return res.status(200).json(new ApiResponse(200, detail, "Channel stats fetched successfully"));

});
const getChannelvideos = asyncHandler(async (req, res) => {

const {channelusername} = req.params;
if (!channelusername) {
    throw new ApiError(400, "Channel username is required");
}
const user = await User.findOne({username:channelusername}).select("-password -refreshtoken ");
if (!user) {
    throw new ApiError(404, "User not found");
}
const videos = await Video.find({owner:user._id , ispublished:true}).sort({createdAt:-1});
return res.status(200).json(new ApiResponse(200, videos, "Channel videos fetched successfully"));

});
export { getChannelStats, getChannelvideos };
 