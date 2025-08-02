import mongoose from "mongoose";
import { DB_Name } from "../constants.js";

const connectDB = async()=>{
    try{
       const connections= await mongoose.connect(`${process.env.MONGODB_URI}/${DB_Name}`)
 console.log(`\n Connection Sucessfull ${connections.connection.host}`)
    }
    catch(error){
        console.log("Error",error);
        process.exit(1);
    }
}
export default connectDB;