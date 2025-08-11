import { Router } from "express";
import { verifyjwt } from "../middlewares/authh.middleware.js";
import { getVideoComments, addComment, updateComment ,deleteComment } from "../controllers/Comment.controller.js";

const commentRoute = Router();

commentRoute.use(verifyjwt);
commentRoute.route("/video/:videoId/comments").get(getVideoComments);
commentRoute.route("/video/:videoId/comments").post(addComment);
commentRoute.route("/video/comments/:commentId").patch(updateComment);
commentRoute.route("/video/comments/:commentId").delete(deleteComment);
export default commentRoute;