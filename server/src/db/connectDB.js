import mongoose from "mongoose";

export const connectDB = async()=>{

   const URI = process.env.MONGODB_URI
   
   try{
      const dbconnection = await mongoose.connect(URI)
         console.log(`Mongodb connected !! DB HOST :${dbconnection.connection.host}`) 
      
   }catch(err){
     console.error("Mongodb connection failed Error:" ,err) 
      process.exit(1) 
   }
}
   