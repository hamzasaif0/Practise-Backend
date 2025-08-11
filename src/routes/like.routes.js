
import { Router } from "express";
import { togglevedioLike, toggleCommentLike, toggleTweetLike, getLikedVideos } from "../controllers/Like.controller.js";
import { verifyjwt } from "../middlewares/authh.middleware.js";
const  likerouter = Router();
likerouter.use(verifyjwt);
likerouter.route("/togglevediolike/:videoId").post(togglevedioLike);
likerouter.route("/togglecommentlike/:commentId").post(toggleCommentLike);
likerouter.route("/toggletweetlike/:tweetId").post(toggleTweetLike);
likerouter.route("/likedvideos").get(getLikedVideos);
export default likerouter;