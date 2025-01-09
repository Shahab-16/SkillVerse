const mongoose=require('mongoose');
const user=require('./models/User');
const auth=require('../middleware/auth');
const profile=require('./models/Profile');


exports.updateProfile=async(req,res)=>{
    try{
        const {
            gender,
            address,
            about,
            dob,
            dreamJob,
            dreamCompany,
        }=req.body

        const userId=req.user.id;

        if(!gender || !address || !about || !dob || !dreamJob || !dreamCompany){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }

        const userDetails=await user.findByid(userId);

        if(!userDetails){
            return res.status(400).json({
                success:false,
                message:"User not found"
            })
        }

        const Profile=await profile.findByid(userDetails.additionalDetails.id);

        if(!Profile){
            return res.status(400).json({
                success:false,
                message:"Profile not found"
            })
        }

        await userDetails.findByidAndUpdate(userId,
            {
                firstName,
                lastName
            }
        )

        Profile.gender=gender;
        Profile.address=address;
        Profile.about=about;
        Profile.dob=dob;
        Profile.dreamJob=dreamJob;
        Profile.dreamCompany=dreamCompany;

        await Profile.save();

        const ProfileDetails=await user.findByid(userId).populate("additionalDetails");

        return res.status(200).json({
            success:true,
            message:"Profile updated successfully",
            ProfileDetails
        })
    }

    catch(err){
        return res.status(500).json({
            success:false,
            message:"Internal server error while updating profile"
        })
    }
}


exports.deleteProfile=async(req,res)=>{

    try{
        const userId=req.user.id;

        const userDetails=await user.findByid(userId);

        if(!userDetails){
            return res.status(400).json({
                success:false,
                message:"User not found"
            })
        }

        const Profile=await profile.findByid(userDetails.additionalDetails.id);

        if(!Profile){
            return res.status(400).json({
                success:false,
                message:"Profile not found"
            })
        }

        await Profile.findByidAndDelete(userDetails.additionalDetails.id);

       for(const courseId of Profile.courses){
           await course.findByidAndUpdate(
               courseId,
               {
                   $pull:{
                       studentsEnrolled:userId
                   },
               }
           )
       } 

        await userDetails.findByidAndDelete(userId);

        return res.statuas(200).json({
            success:true,
            message:"Profile deleted successfully"
        })
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:"Internal server error while deleting profile"
        })
    }
}


exports.getProfileDetails=async(req,res)=>{
    try{
        const userId=req.user.id;

        const userDetails=await user.find({_id:userId}).populate("additionalDetails").exec();

        return res.status(200).json({
            success:true,
            message:"Profile details fetched successfully",
            userDetails
        })
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:"Internal server error while getting profile details"
        })
    }
}


exports.updateProfilePic=async(req,res)=>{
    try{
        const userId=req.user.id;
        const {updatedProfilePic}=req.files;

        const userDetails=await user.findById(userId);

        if(!userDetails){
            return res.status(400).json({
                success:false,
                message:"User not found"
            })
        }

        if(!updatedProfilePic){
            return res.status(400).json({
                success:false,
                message:"Profile pic not found"
            })
        }

        const image=await uploadImageToCloudinary(
            updatedProfilePic,
            process.env.Folder_Name,
            1000,
            1000
        )

        const updatedProfile=await user.findByidAndUpdate(
            {_id:userId},
            {image:image.secure_url},
            {new:true}
        )

        return res.status(200).json({
            success:true,
            message:"Profile pic updated successfully",
            updatedProfile
        })


    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:"Internal server error while updating profile pic"
        })
    }
}


exports.getEnrolledCourses = async (req, res) => {
    try {
      const userId = req.user.id
      let userDetails = await User.findOne({
        _id: userId,
      })
        .populate({
          path: "courses",
          populate: {
            path: "courseContent",
            populate: {
              path: "subSection",
            },
          },
        })
        .exec()
      userDetails = userDetails.toObject()
      var SubsectionLength = 0
      for (var i = 0; i < userDetails.courses.length; i++) {
        let totalDurationInSeconds = 0
        SubsectionLength = 0
        for (var j = 0; j < userDetails.courses[i].courseContent.length; j++) {
          totalDurationInSeconds += userDetails.courses[i].courseContent[
            j
          ].subSection.reduce((acc, curr) => acc + parseInt(curr.timeDuration), 0)
          userDetails.courses[i].totalDuration = convertSecondsToDuration(
            totalDurationInSeconds
          )
          SubsectionLength +=
            userDetails.courses[i].courseContent[j].subSection.length
        }
        let courseProgressCount = await CourseProgress.findOne({
          courseID: userDetails.courses[i]._id,
          userId: userId,
        })
        courseProgressCount = courseProgressCount?.completedVideos.length
        if (SubsectionLength === 0) {
          userDetails.courses[i].progressPercentage = 100
        } else {
          // To make it up to 2 decimal point
          const multiplier = Math.pow(10, 2)
          userDetails.courses[i].progressPercentage =
            Math.round(
              (courseProgressCount / SubsectionLength) * 100 * multiplier
            ) / multiplier
        }
      }
  
      if (!userDetails) {
        return res.status(400).json({
          success: false,
          message: `Could not find user with id: ${userDetails}`,
        })
      }
      return res.status(200).json({
        success: true,
        data: userDetails.courses,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
  }
  
  exports.instructorDashboard = async (req, res) => {
    try {
      const courseDetails = await Course.find({ instructor: req.user.id })
  
      const courseData = courseDetails.map((course) => {
        const totalStudentsEnrolled = course.studentsEnroled.length
        const totalAmountGenerated = totalStudentsEnrolled * course.price
  
        // Create a new object with the additional fields
        const courseDataWithStats = {
          _id: course._id,
          courseName: course.courseName,
          courseDescription: course.courseDescription,
          // Include other course properties as needed
          totalStudentsEnrolled,
          totalAmountGenerated,
        }
  
        return courseDataWithStats
      })
  
      res.status(200).json({ courses: courseData })
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: "Server Error" })
    }
  }