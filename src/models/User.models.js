
import mongoose from "mongoose";
import  jwt  from "jsonwebtoken";
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
username:{
    type:String,
    unique:true,
    required:true,
    lowercase:true,
    trim:true,
    index:true
},
email:{
    type:String,
    unique:true,
    required:true,
    lowercase:true,
    trim:true
},
fullname:{
    type:String,
    index:true,
    required:true,
    trim:true
},
avatar:{
    type:String,  //cloudinary
required:true,
},
coverimage:{
     type:String,  

},
watchhistory:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Video"
    }
],
password:{
type:String,
required:[true,'Password is Required'],


},
refreshtoken:{
    type:String,

}
}
,{
    timestamps:true
}

)
userSchema.pre("save",async function (next){
    if(!this.isModified("password")) return next(); // agar user apne passowrd ko change wagera nahi karta koi or chezz change karke save karta tab ye stement run kare gi
    this.password =  await bcrypt.hash(this.password,10); // ye tab run kare gi agar user apne passowrd ko update ya change karta
    next();
})
userSchema.methods.checkpassword = async function (password) {
    return await bcrypt.compare(password,this.password)
    
}
userSchema.methods.generateAccessToken = function (){
   return jwt.sign({
        _id : this._id,
        username:this.username,
        email : this.email,
        fullname:this.fullname
    },
    process.env.ACCESS_TOKEN,
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    }

)
}
userSchema.methods.generateRefreshToken = function (){
     return jwt.sign({
        _id : this._id,
      
    },
    process.env.REFRESH_TOKEN,
    {
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    }

)
    
}
export const User = mongoose.model("User",userSchema);