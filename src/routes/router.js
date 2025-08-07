import { Router } from "express";
import {
  changePassword,
  currentUser,
  loginuser,
  logoutuser,
  profileStatus,
  refreshAccesstoken,
  registercontol,
  updateAvatar,
  updateCoverimage,
  updateUser,
  watchhistory,
} from "../controllers/usecontroller.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyjwt } from "../middlewares/authh.middleware.js";

const router = Router();
router.route("/register").post(
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverimage", maxCount: 1 },
  ]),
  registercontol
);

router.route("/login").post(loginuser);

router.route("/logout").post(verifyjwt, logoutuser);
router.route("/refreshaccesstoken").post(refreshAccesstoken);
router.route("/change-password").post(verifyjwt, changePassword);
router.route("/currentuser").get(verifyjwt, currentUser);
router.route("/updateuser").patch(verifyjwt, updateUser);
router
  .route("/updateavatar")
  .post(verifyjwt, upload.single("avatar"), updateAvatar);
router
  .route("/updatecoverimage")
  .patch(verifyjwt, upload.single("coverimage"), updateCoverimage);
router.route("/c/:username").get(verifyjwt, profileStatus);
router.route("/watchhistory").get(verifyjwt, watchhistory);

export default router;
