const mongoose=require('mongoose');

const courseSchema=new mongoose.Schema({
    courseName:{
        type:String,
        required:true,
        trim:true
    },
    courseDescription:{
        type:String,
        required:true,
        trim:true
    },
    price:{
        type:Number,
        required:true,
        trim:true
    },
    WhatYouwWillLearn:{
        type:String,
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category"
    },
    thumbnail:{
        type:String,
        required:true,
    },
    courseContent:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Section"
    }],
    ratingAndReview:[{
        type:mongoose.Schema.Types.Id,
        ref:"RatingAndReview"
    }],
    courseProgress:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"CourseProgress",
    }],
    enrolledUsers:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    instructors:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    createdAt:{
        type:Date,
        default:Date.now()
    }
});


module.exports=mongoose.model('Courses',courseSchema);