const course=require('./models/Courses');
const user=require('./models/User');
const courseProgress=require('./models/CourseProgress');
const mongoose=require('mongoose');
const category=require('./models/category');
const {uploadToCloudinary}=require('../utils/uploadToCloudinary');


exports.createCourse=async(req,res)=>{
    try{
        const userId=req.user.id;
        const {
            title,
            description,
            price,
            category,
        }=req.body;


        const thumbnail=req.files.thumbnailImage;


        if(!title||!description||!thumbnail||!price||!category){
            return res.status(400).json({
                success:false,    
                message:"All fields are required"
            });
        }

        const courseExist=await course.findOne({title});
        if(courseExist){
            return res.status(400).json({
                success:false,    
                message:"Course already exists"
            });
        };

        const instructorDetails=await user.findById({userId});

        if(!instructorDetails){
            return res.status(400).json({
                success:false,
                message:"Instructor Not found"
            })
        }

        const categoryDetails=await category.findById({userId});

        if(!categoryDetails){
            return res.status(400).json({
                success:false,
                message:"Category Not Found"
            })
        }

        const thumbnailImage=await uploadToCloudinary(
            thumbnail,
            process.env.FolderName,
        )

        const newCourse=await course.create({
            title:title,
            description:description,
            price:price,
            thumbnail:thumbnailImage,
            category:categoryDetails.id,
            instructor:instructorDetails.id,
        })

        await user.findByidAndUpdate(
            {_id:instructorDetails._id},
            {
                $push:{
                    courses:newCourse._id,
                },
            },
            {new:true}
        )

        await category.findByidAndUpdate(
            {_id:categoryDetails._id},
            {
                $push:{
                    category:categoryDetails._id,
                },
            },
            {new:true}
        )

        return res.status(200).json({
            success:true,
            message:"Course Created Successfully"
        })

    }catch(err){
        return res.status(400).json({
            success:false,
            message:"Failed to create Course",
        })
    }
}



exports.deleteCourse=async(req,res)=>{
    try{
        const courseId=req.course.id;

        if(!courseId){
            return res.status(400).json({
                success:false,
                message:"Course not found",
            })
        }

        await course.findByIdAndDelete({
            _id:courseId,
        })

        await courseProgress.deleteMany({
            course:courseId
        })

        await user.updateMany(
            {},
            {
                $pull:{
                    courses:courseId,
                }
            }
        )

        await category.updateMany(
            {},
            {
                $pull:{
                    category:courseId,
                }
            }
        )

        return res.status(200).json({
            success:true,
            message:"Course Deleted Successfully"
        })
    }

    catch(err){
        return res.status(400).json({
            success:false,
            message:"Failed to delete Course",
        })
    }
}


exports.editCourse=async(req,res)=>{
    try{

    }
    catch(err){

    }
}



