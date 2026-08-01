import mongoose from "mongoose";

const verificationSchema=new mongoose.Schema({

phone:{
type:String,
required:true,
unique:true
},

verified:{
type:Boolean,
default:true
},

verifiedAt:{
type:Date,
default:Date.now
},

expiresAt:{
type:Date,
expires:1800
}

});

export const MobileVerification=
mongoose.model("MobileVerification",verificationSchema);