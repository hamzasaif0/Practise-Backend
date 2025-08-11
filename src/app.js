
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
const app = express();
app.use(cors({
    origin: process.env.CORS_URL,
    credentials:true
}))
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true , limit:"16kb"}))
app.use(express.static('public'))
app.use(cookieParser())
//routes imports

import userRoutes from './routes/router.js';
app.use('/api/v1/users',userRoutes);
import videoRoutes from './routes/vedio.routes.js';

app.use('/api/v1/videos',videoRoutes);
import subscriptionroute from './routes/subscription.routes.js';
app.use('/api/v1/subscriptions',subscriptionroute);
import tweetroute from './routes/tweet.routes.js';
app.use('/api/v1/tweet',tweetroute);
export default app;