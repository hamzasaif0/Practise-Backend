import { Subscription } from "../models/Subscription.models.js";
import asyncHandler from "../utils/asyncHandler.js";
import  ApiError from "../utils/ApiError.js";
import ApiResponse  from "../utils/APiresponse.js";
import { subscribe } from "diagnostics_channel";
import mongoose from "mongoose";
import { User } from "../models/User.models.js";
const toggleSubscription = asyncHandler(async (req, res) => {

   const { channelId } = req.params;
    if (!channelId) {
        throw new ApiError(400, "Channel ID is required");
    }
      if(channelId.toString()=== req.user._id.toString()){
         throw new ApiError(400, "You cannot subscribe to your own channel");

  }
    const channel = await User.findById(channelId);
    if (!channel) {
        throw new ApiError(404, "Channel not found");
    }

    const existingSubscription = await Subscription.findOne({ 
        channel: channelId,
        subscriber: req.user._id
    });
    if(existingSubscription) {
        await Subscription.findByIdAndDelete(existingSubscription._id);
        return res.status(200).json(new ApiResponse(200, null, "Unsubscribed successfully"));
    }
    const subscription = await Subscription.create({
        channel: channelId,
        subscriber: req.user._id
    });

    return res.status(200).json(new ApiResponse(200, subscription, "Subscribed successfully"));


});
const getUserchannelSubscribers = asyncHandler(async (req, res) => {

    const { channelId } = req.params;
    if (!channelId) {
        throw new ApiError(400, "Channel ID is required");
    }
    const channel = await User.findById(channelId);
    if (!channel) {
        throw new ApiError(404, "Channel not found");
    }
  const totalSubscribers = await Subscription.aggregate([
    {
        $match: { channel: new mongoose.Types.ObjectId(channelId)}
    },
    {
        $lookup: {
            from: "users",
            localField: "subscriber",
            foreignField: "_id",
            as: "subscribers"
        }
    },
    {

        $project: {
            _id:0,
           subscribers: 1

    }}
  
  ]);

   const totalsubs = totalSubscribers.flatMap(obj => obj.subscribers);
  const detail = {
     totalsubs: totalsubs.length,
    info: totalsubs,
  };



return res.status(200).json(new ApiResponse(200, detail, "Subscribers fetched successfully"));
});
const getSubscribedChannels = asyncHandler(async (req, res) => {
const {channelId} = req.params;
if (!channelId) {
    throw new ApiError(400, "Channel ID is required");
}
const channel = await User.findById(channelId);
if (!channel) {
    throw new ApiError(404, "Channel not found");
}
const existingSubscription = await Subscription.aggregate([
    {
        $match: { subscriber: new mongoose.Types.ObjectId(channelId)  }
    },
    {
        $lookup: {
            from: "users",
            localField: "channel",
            foreignField: "_id",
            as: "SubscribedChannels"
        }
    },
    {
        $project: {
            _id: 0,
            SubscribedChannels: 1
        }
    }
]) ;
const subscribedChannels = existingSubscription.flatMap(obj => obj.SubscribedChannels);
const detail = {
    subscribedChannels: subscribedChannels.length,
    info: subscribedChannels,
};
return res.status(200).json(new ApiResponse(200, detail, "Subscribed channels fetched successfully"));


});
export { toggleSubscription, getUserchannelSubscribers, getSubscribedChannels };