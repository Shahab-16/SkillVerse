const mongoose=require('mongoose');

const courseProgressSchema=new mongoose.Schema({
    courseId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Courses",
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    completedVideos:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"SubSection",
    }]
});


module.exports=mongoose.model('CourseProgress',courseProgressSchema);