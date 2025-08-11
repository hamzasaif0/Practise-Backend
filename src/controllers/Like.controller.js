import { Comment } from "../models/Comment.models.js";
import { Like } from "../models/Like.models.js";
import { Tweet } from "../models/Tweet.models.js";
import { Video } from "../models/Vedios.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/APiresponse.js";
import mongoose,{ Types } from "mongoose";
import asyncHandler from "../utils/asyncHandler.js";

const togglevedioLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    if (!videoId) {
        throw new ApiError(400, "Video ID is required");
    }
    
    const video = await Video.findById(videoId);  
    if (!video) {
        throw new ApiError(404, "Video not found");
    }
    const existingLike = await Like.findOne({
        video: videoId,
        likedby: req.user._id
    });
    let check = true;
    if(existingLike) {
        await Like.findByIdAndDelete(existingLike._id);
        await video.save();
        check = false;
    }
    else{
        const like =  await Like.create({
            video: videoId,
            likedby: req.user._id
        });

    }
    return res.status(200).json(new ApiResponse(200, null, `${check ? "Video liked successfully" : "Video unliked successfully"}`));


});
const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params ;
    if(!commentId){
        throw new ApiError(400,"commentId Required");
    }
    const comment = await Comment.findById(commentId);
    if(!comment){
        throw new ApiError(400,"Unknown commentId ");
    }
    const existingLike = await Like.findOne({
      comment:  commentId,
       likedby: req.user._id
    }
    )
    let check = true;
if(!existingLike){
    await Like.create({
        comment : commentId,
        likedby : req.user._id
    }
    )
}
else{
    await Like.findByIdAndDelete(existingLike._id);
    check = false;
}
return res.status(200).json(new ApiResponse(200, null, `${check ? "Comment liked successfully" : "Comment unliked successfully"}`));
});
const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
     if(!tweetId){
             throw new ApiError(400,"TweetID Required");
     }
      const tweet = await Tweet.findById(tweetId);
    if(!tweet){
        throw new ApiError(400,"Unknown tweetId ");
    }
    const existingLike = await Like.findOne({
      tweet:  tweetId,
       likedby: req.user._id
    }
    )
    let check = true;
if(!existingLike){
    await Like.create({
        tweet : tweetId,
        likedby : req.user._id
    }
    )
}
else{
    await Like.findByIdAndDelete(existingLike._id);
    check = false;
}
return res.status(200).json(new ApiResponse(200, null, `${check ? "Tweet liked successfully" : "Tweet unliked successfully"}`));
}
);
const getLikedVideos = asyncHandler(async (req, res) => {
          const list = await Like.aggregate([{
           $match:{
            likedby :new mongoose.Types.ObjectId(req.user._id)
           }
            
          },
          {
            $lookup:{
                from :"videos",
                localField:"video",
               foreignField:"_id",
               as:"LikedVedios"
            }
        }
 
    ]
        )
        return res.status(200).json( new ApiResponse(200,list , "Liked vedios fetched Success Fully"));
});

export { togglevedioLike, toggleCommentLike, toggleTweetLike, getLikedVideos };