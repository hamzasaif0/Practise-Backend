import { Router } from "express";
import  { createTweet, getUserTweets, updateTweet, deleteTweet } from "../controllers/Tweet.controller.js";
import { verifyjwt } from "../middlewares/authh.middleware.js";
const tweetroute = Router();
tweetroute.use(verifyjwt);
tweetroute.route("/tweet").post(createTweet).get(getUserTweets);
tweetroute.route("/tweet/:tweetId").patch(updateTweet).delete(deleteTweet);
export default tweetroute;