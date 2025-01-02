const cloudinary = require('cloudinary').v2

exports.uploadToCloudinary=async(file,folder,height,width,quality)=>{
    const options={folder};
    if(height){
        options.height=height;
    }
    if(width){
        options.width=width;
    }
    if(quality){
        options.quality=quality;
    }
    options.resource_type='auto';
    return await cloudinary.uploader.upload(file,options);
}