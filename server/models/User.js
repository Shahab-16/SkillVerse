const mongoose = require('mongoose');


const userSchema=new mongoose.Schema({
    firstName:{
        type: String,
        trim:true,
        requried:true
    },
    lastName:{
        type: String,
        trim:true,
        requried:true
    },
    email:{
        type: String,
        trim:true,
        requried:true
    },
    password:{
        type: String,   
        trim:true,
        requried:true  
    },
    confirmPassword:{
        type: String,
        trim:true,  
        requried:true,
    },
    phoneNumber:{
        type:Number,
        trim:true,
        requried:true,
    },
    accountType:{
        type:String,
        enum:["Student","Instructor","Admin"],
        default:"Student",
    },

    additionalDetails: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
    },

    courses:[{
        type:mongoose.Schema.Types.objectId,
        ref:"Courses"
    }],

    courseProgress:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'CourseProgress',
    },
    token:{
        type:String,
    },
})


module.exports=mongoose.Schema('User',userSchema);