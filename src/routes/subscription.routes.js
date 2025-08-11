import { Router } from "express";
import { verifyjwt } from "../middlewares/authh.middleware.js";
import {getUserchannelSubscribers,getSubscribedChannels,toggleSubscription } from "../controllers/Subscription.controller.js";

const subscriptionroute = Router();
subscriptionroute.use(verifyjwt);
subscriptionroute.route("/channelsubscriber/:channelId").get(getUserchannelSubscribers);
subscriptionroute.route("/toggleSubscription/:channelId").post(toggleSubscription);
subscriptionroute.route("/getSubscribedChannels/:channelId").get(getSubscribedChannels);
export default subscriptionroute;