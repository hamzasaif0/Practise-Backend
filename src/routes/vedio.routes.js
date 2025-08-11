
import { Router } from "express";
import { deleteVideo, getAllVideos, getVideoById, publishVideo, toggleVideoPublishStatus, updateVideo } from "../controllers/Vedio.controllers.js";
import { verifyjwt } from "../middlewares/authh.middleware.js";
import { upload } from "../middlewares/multer.middlewares.js";
const Route = Router();
Route.use(verifyjwt);
Route.route("/publishvideo").post(upload.fields([
    { name: "videofile", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),publishVideo
);
Route.route("/getallvideos").get(getAllVideos);
Route.route("/:videoId").get(getVideoById);
Route.route("/:videoId").patch(upload.single("thumbnail"), updateVideo);
Route.route("/:videoId").delete(deleteVideo);
Route.route("/togglestatus/:videoId").patch(toggleVideoPublishStatus);


export default Route;
