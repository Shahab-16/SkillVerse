const mongoose=require('mongoose');

const otpschema=new mongoose.Schema({
    otp:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires:60*60
    }
});

module.exports=mongoose.model('OTP',otpschema);