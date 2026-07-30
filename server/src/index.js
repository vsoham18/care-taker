import "dotenv/config";
import express from 'express' 
import { app } from './app.js'
import { connectDB } from "./db/connectDB.js";
const port = process.env.PORT 

connectDB(). 
then(()=>{
    app.listen(port,()=>{
       console.log(`App is running on http://localhost:${port}`);
}) 
}).
catch((err)=>{
    console.log("MongoDB connection failed error :", err)
})

