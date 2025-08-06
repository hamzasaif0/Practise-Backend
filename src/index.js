// require('dotenv').config()
import dotenv from 'dotenv'
import express from 'express';
import connectDB from "./db/DB.js";
import app from './app.js'
dotenv.config(
    {
        path:'./.env'
    }
)

connectDB()
.then(()=>{
    app.listen(process.env.PORT||8000,()=>{
        console.log(`App is Running on Port${process.env.PORT}`)
    })
})


.catch((error)=>{
    console.log("Mongo Db connection failed",error);
})


// const app = express();
// (async()=>{
//     try{

//            await  mongoose.connect(`${process.env.MONGODB_URI}/${DB_Name}`)
//            app.on("error",(error)=>{
//             console.log("Eror",error);
//             throw error;
//            })
//            app.listen(process.env.PORT,()=>{
//             console.log(`App is listening on port ${process.env.PORT}`)
//            })
//     }
//     catch(error){
//         console.log("error",error);
//         throw error
//     }
// })
// ();