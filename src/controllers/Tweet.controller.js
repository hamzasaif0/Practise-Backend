import { Tweet } from "../models/Tweet.models.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/APiresponse.js";
import asyncHandler from "../utils/asyncHandler.js"

const createTweet = asyncHandler( async (req, res) => {
const { content } = req.body;
    if (!content || content.trim() === "") {
        throw new ApiError(400, "Content is required");
    }
    const tweet = await Tweet.create({
        content,
        owner: req.user._id
    });
return res.status(201).json( new ApiResponse(201, tweet, "Tweet created successfully"));
});
const getUserTweets = asyncHandler(async (req, res) => {
    const tweets = await Tweet.find({ owner: req.user._id }).populate("owner", "username").sort({ createdAt: -1 });
    if (!tweets || tweets.length === 0) {
        return res
            .status(200)
            .json(new ApiResponse(200, [], "No tweets found for this user"));
    }
        return res.status(200).json(new ApiResponse(200, tweets, "User tweets fetched successfully"));



});
const updateTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
    const { content } = req.body;
    if (!content || content.trim() === "") {
        throw new ApiError(400, "Content is required");
    }
    const tweet = await Tweet.findById(tweetId);
    if( !tweet) {
        throw new ApiError(404, "Tweet not found");
    }
    if (tweet.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this tweet");
    }
    tweet.content = content;
    await tweet.save();
    return res.status(200).json(new ApiResponse(200, tweet, "Tweet updated"));



});
const deleteTweet = asyncHandler(async (req, res) => {
const { tweetId } = req.params;
    if(!tweetId) {
        throw new ApiError(400, "Tweet ID is required");
    }
    const tweet = await Tweet.findById(tweetId);
  if(!tweet){
        throw new ApiError(404, "Tweet not found");
    
  }
    if (tweet.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to delete this tweet");
    }
    await tweet.remove();
    return res.status(200).json(new ApiResponse(200, null, "Tweet deleted successfully"));
});
export { createTweet, getUserTweets, updateTweet, deleteTweet };