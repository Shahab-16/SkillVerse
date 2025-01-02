const course=require('../models/Courses');
const section=require('../models/Section');
const subSection=require('../models/SubSection');


exports.createSection=async(req,res)=>{
    try{
        const {sectionName,courseId}=req.body;

        if(!sectionName||!courseId){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }

        if(!course.findById(courseId)){
            return res.status(400).json({
                success:false,
                message:"Course not found"
            })
        }

        if(section.findById(sectionName)){
            return res.status(400).json({
                success:false,
                message:"Section already exists"
            })
        }

        const newSection =await section.create({
            sectionName:sectionName,
            course:courseId
        })

        const updatedCourse=await course.findByIdAndUpdate(
            courseId,
            {
                $push:{
                    courseContent:newSection._id,
                },
            },
            {new:true}
        ).populate({
            path:"courseContent",
            populate:{
                path:"subSection",
            }
        }).exec();

        return res.status(200).json({
            success:true,
            message:"Section created successfully",
            data:updatedCourse
        })
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:"Internal server error while creating Section"
        })
    }
}


exports.updateSection=async(req,res)=>{
    try{
        const {newSectionName,courseId,sectionId}=req.body;

        if(!newSectionName||!courseId||!sectionId){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }

        const updatedSection=await section.findByIdAndUpdate(
            sectionId,
            {
                sectionName:newSectionName,
            },
            {new:true}
        )
        const course=await course.findByIdAndUpdate(
            courseId,
            {
                $set:{
                    courseContent:updatedSection._id
                }
            }
        ).populate({
            path:"courseContent",
            populate:{
                path:"subSection",
            },
        }).exec();

        return res.status(200).json({
            success:true,
            message:"Section updated successfully",
            data:course
        })
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:"Internal server error while updating Section"
        })
    }
}


exports.deleteSection=async(req,res)=>{
    try{
        const {sectionId,courseId}=req.body;

        if(!sectionId||!courseId){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }

        const Course=await course.findById(
            courseId,
            {
                $pull:{
                    courseContent:sectionId
                },
            }
        )

        const existSection=await section.findById(sectionId);

        if(!existSection){
            return res.status({
                success:false,
                message:"Section not found"
            })
        }

        await subSection.deleteMany({_id:{$in:existSection.subSection}});
        await section.findByIdAndDelete(sectionId);

        return res.status(200).json({
            success:true,
            message:"Section deleted successfully",
            data:Course
        })
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:"Internal server error while deleting Section"
        })
    }
}