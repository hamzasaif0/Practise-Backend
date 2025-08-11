
import { Router } from "express";
import {getChannelStats, getChannelvideos} from "../controllers/Dashboard.controller.js";
import { verifyjwt } from "../middlewares/authh.middleware.js";

const dashrouter = Router();
dashrouter.use(verifyjwt);
dashrouter.route("/dashboard/:channelusername").get(getChannelStats);
dashrouter.route("/dashboard/:channelusername").get(getChannelvideos);
export default dashrouter;