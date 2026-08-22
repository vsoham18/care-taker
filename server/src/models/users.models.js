import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },

    phoneVerified: {
      type: Boolean,
      default: false,
    },

    isCaretaker: {
      type: Boolean,
      default: false,
    },

    caretakerProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CaretakerProfile",
      default: null,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    
    refreshToken:{
        type: String
    }
  },
  {
    timestamps: true,
  }
);

userSchema.index({ location: "2dsphere" });

userSchema.pre("save", async function (next) {
    if(this.isModified("password")) {
     this.password = await bcrypt.hash(this.password,10)
   }
})

userSchema.methods.isPasswordsCorrect = async function (password) {
      return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken = function (){
   return jwt.sign(
      {
          _id : this._id,
          _email : this.email,
          username : this.username,
          fullName:this.fullname
      },
     process.env.ACCESS_TOKEN_SECRET,
     {
        expiresIn : process.env.ACCESS_TOKEN_EXPIRY
     }
    )
}

userSchema.methods.generateRefreshToken = function (){
    return jwt.sign(
      {
          _id : this._id,
        
      },
     process.env.REFRESH_TOKEN_SECRET,
     {
        expiresIn : process.env.REFRESH_TOKEN_EXPIRY
     }
    )
}

userSchema.plugin(mongooseAggregatePaginate);

export const User = mongoose.model("User", userSchema);