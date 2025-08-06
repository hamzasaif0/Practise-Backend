
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';



    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_NAME, 
        api_key: process.env.CLOUDINARY_KEY, 
        api_secret: process.env.CLOUDINARY_SECRET // Click 'View API Keys' above to copy your API secret
    });


    const uploadfile = async (file)=>{
        try{
            if(!file){ return null;}
      const uploadResult1 = await cloudinary.uploader.upload(file, {
               resource_type:"auto",
           } )

        //   console.log("File is upload is Sucessfully",uploadResult1.url)
         fs.unlinkSync(file);
  return uploadResult1;
        }
        catch(error){
           fs.unlinkSync(file);
           return null;
        }
    }
    
   
export default uploadfile



   
    // // Optimize delivery by resizing and applying auto-format and auto-quality
    // const optimizeUrl = cloudinary.url('shoes', {
    //     fetch_format: 'auto',
    //     quality: 'auto'
    // });
    
    // console.log(optimizeUrl);
    
    // // Transform the image: auto-crop to square aspect_ratio
    // const autoCropUrl = cloudinary.url('shoes', {
    //     crop: 'auto',
    //     gravity: 'auto',
    //     width: 500,
    //     height: 500,
    // });
    
    // console.log(autoCropUrl);    