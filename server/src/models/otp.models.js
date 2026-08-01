import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
{
    phone:{
        type:String,
        required:true,
        index:true
    },

    otp:{
        type:String,      // hashed
        required:true
    },

    purpose:{
        type:String,
        enum:[
            "advertisement",
            "register"
        ],
        required:true,
        default:"advertisement"
    },

    attempts:{
        type:Number,
        default:0 
    },

    expiresAt:{
        type:Date,
        required:true,
        expires:0
    }
},
{
timestamps:true
});

export const OTP = mongoose.model("OTP",otpSchema);