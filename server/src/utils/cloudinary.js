import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

 cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

const uploadOnCloudinary = async (localFilePath)=>{
    try{
    if(!localFilePath) return null 

     const response = await cloudinary.uploader.upload(localFilePath,{
        resource_type : "auto"
     })
     
       return response 
    }
    catch(error){
         console.error("Cloudinary Upload Error:", error);
    
        return null;
    }
    finally{
        fs.unlinkSync(localFilePath);
    }
}

const deleteFromCloudinary = async (publicId) => {
  try {
    if (!publicId) return;

    await cloudinary.uploader.destroy(publicId);

    console.log("Old image deleted successfully.");
  } catch (error) {
    console.error("Cloudinary Delete Error:", error);
  }
};

export {uploadOnCloudinary, deleteFromCloudinary};