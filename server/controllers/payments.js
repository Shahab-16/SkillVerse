const course=require('../models/Courses');
const user=require('../models/User');
const payment=require('../models/Payments');
const {instance}=require('../config/razorpay');
const crypto=require('crypto');
const mailSender=require('../utils/mailsender');



exports.capturePayment=(req,res)=>{
    try{
        const courseId=req.body.courseId;
    const userId=req.user.id;
    if(!courseId||!userId){
        return res.status(400).json({
            success:false,
            message:"No course id or user id found"
        })
    }

    const courseDetails=course.findById(courseId);

    if(!courseDetails){
        return res.status(400).json({
            success:false,
            message:"Course not found"
        })
    }

    const ui=new mongoose.Types.ObjectId(userId);

    if(courseDetails.studentsEnrolled.includes(ui)){
        return res.status(400).json({
            success:false,
            message:"You have already enrolled in this course"
        })
    }


    const options={
        amount:courseDetails.price*100,
        currency:"INR",
        receipt:crypto.randomBytes(20).toString('hex')
    }

    try{
        const paymentResponse=instance.orders.create(options);
        console.log(paymentResponse);
        return res.status(200).json({    
            success:true,
            courseDetails:courseDetails,
            order:paymentResponse
        })
    }
    catch(err){
        return res.status(400).json({
            success:false,
            message:"Internal server error while capturing payment"
        })
    }

    }catch(err){
        return res.status(400).json({
            success:false,
            message:"Internal server error while capturing payment"
        })
    }
    

}



exports.verifyPayment = async (req, res) => {
    const razorpay_order_id = req.body?.razorpay_order_id
    const razorpay_payment_id = req.body?.razorpay_payment_id
    const razorpay_signature = req.body?.razorpay_signature
    const courses = req.body?.courses
  
    const userId = req.user.id
  
    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !courses ||
      !userId
    ) {
      return res.status(200).json({ success: false, message: "Payment Failed" })
    }
  
    let body = razorpay_order_id + "|" + razorpay_payment_id
  
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body.toString())
      .digest("hex")
  
    if (expectedSignature === razorpay_signature) {
      await enrollStudents(courses, userId, res)
      return res.status(200).json({ success: true, message: "Payment Verified" })
    }
  
    return res.status(200).json({ success: false, message: "Payment Failed" })
  }
  
  // Send Payment Success Email
  exports.sendPaymentSuccessEmail = async (req, res) => {
    const { orderId, paymentId, amount } = req.body
  
    const userId = req.user.id
  
    if (!orderId || !paymentId || !amount || !userId) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide all the details" })
    }
  
    try {
      const enrolledStudent = await User.findById(userId)
  
      await mailSender(
        enrolledStudent.email,
        `Payment Received`,
        paymentSuccessEmail(
          `${enrolledStudent.firstName} ${enrolledStudent.lastName}`,
          amount / 100,
          orderId,
          paymentId
        )
      )
    } catch (error) {
      console.log("error in sending mail", error)
      return res
        .status(400)
        .json({ success: false, message: "Could not send email" })
    }
  }
  
  // enroll the student in the courses
  const enrollStudents = async (courses, userId, res) => {
    if (!courses || !userId) {
      return res
        .status(400)
        .json({ success: false, message: "Please Provide Course ID and User ID" })
    }
  
    for (const courseId of courses) {
      try {
        // Find the course and enroll the student in it
        const enrolledCourse = await Course.findOneAndUpdate(
          { _id: courseId },
          { $push: { studentsEnroled: userId } },
          { new: true }
        )
  
        if (!enrolledCourse) {
          return res
            .status(500)
            .json({ success: false, error: "Course not found" })
        }
        console.log("Updated course: ", enrolledCourse)
  
        const courseProgress = await courseProgress.create({
          courseID: courseId,
          userId: userId,
          completedVideos: [],
        })
        const enrolledStudent = await user.findByIdAndUpdate(
          userId,
          {
            $push: {
              courses: courseId,
              courseProgress: courseProgress._id,
            },
          },
          { new: true }
        )
  
        console.log("Enrolled student: ", enrolledStudent)
        const emailResponse = await mailSender(
          enrolledStudent.email,
          `Successfully Enrolled into ${enrolledCourse.courseName}`,
          courseEnrollmentEmail(
            enrolledCourse.courseName,
            `${enrolledStudent.firstName} ${enrolledStudent.lastName}`
          )
        )
  
        console.log("Email sent successfully: ", emailResponse.response)
      } catch (error) {
        console.log(error)
        return res.status(400).json({ success: false, error: error.message })
      }
    }
  }