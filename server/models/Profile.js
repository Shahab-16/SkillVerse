const mongoose=require('mongoose');


const profileSchema=new mongoose.Schema({
    gender:{
        type:String,
    },
    address:{
        type:String,
    },
    about:{
        type:String,
    },
    dob:{
        type:String,
    },
    dreamJob:{
        type:String,
    },
    dreamCompany:{
        type:String,
    },
})

module.exports=mongoose.model(Profile,'profileSchema');