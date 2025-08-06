
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
export default app;