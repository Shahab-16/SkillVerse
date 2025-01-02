const mongoose=require('mongoose');


const catergorySchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        required:true,
        trim:true
    },
    courses:[{
        type:mongoose.Schema.Type.ObjectId,
        ref:"Courses"
    }]
})

module.exports=mongoose.model('Category',catergorySchema);