import { Router } from "express";
import {loginuser, logoutuser, refreshAccesstoken, registercontol} from "../controllers/usecontroller.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyjwt } from "../middlewares/authh.middleware.js";


const router = Router();
router.route('/register').post( upload.fields([
    {name:"avatar", maxCount:1},
    { name:"coverimage", maxCount:1 }
]),registercontol);

router.route('/login').post(loginuser);

router.route('/logout').post(verifyjwt,logoutuser);
router.route('/refreshaccesstoken').post(refreshAccesstoken);

export default router;