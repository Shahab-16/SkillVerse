const course = require("../models/Courses");
const section = require("../models/Section");
const user = require("../models/User");
const ratingAndReview = require("../models/RatingAndReview");

exports.createRatingAndReview = async (req, res) => {
  try {
    const { rating, review, courseId } = req.body;
    const userId = req.user.id;

    const courseDetails = await course.findOne({
      _id: courseId,
      studentsEnrolled: { $elemMatch: { $eq: userId } },
    });

    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: "Course not found",
      });
    }

    const alreadyRatedReview = await ratingAndReview.findOne({
      user: userId,
      course: courseId,
    });

    if (alreadyRatedReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this course",
      });
    }

    const ratingReview = await ratingAndReview.create({
      rating: rating,
      review: review,
      user: userId,
      course: courseId,
    });

    await course
      .findById(courseId, {
        $push: {
          ratingAndReviews: ratingReview._id,
        },
      })
      .populate({
        path: "ratingAndReviews",
        populate: { path: "user" },
      })
      .exec();
    //await courseDetails.save();

    res.status(200).json({
      success: true,
      message: "Rating and review created successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server error while creating rating and review",
    });
  }
};

exports.getAvgRatingAndReview = async (req, res) => {
  try {
    const courseId = req.body.courseId;

    const result = await ratingAndReview.aggregate([
      {
        $match: {
          course: new mongoose.Types.ObjectId(courseId),
        },
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
        },
      },
    ]);

    if (result.length > 0) {
      return res.status(200).json({
        success: true,
        averageRating: result[0].averageRating,
      });
    }

    return res.status(200).json({
      success: true,
      averageRating: 0,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server error while getting average rating and review",
    });
  }
};

exports.getAllRatingAndReview = async (req, res) => {
  try {
    const allReviews = await ratingAndReview
      .find({})
      .sort({ rating: "desc" })
      .populate({
        path: "user",
        select: "firstName lastName email image",
      })
      .populate({
        path: "course",
        select: "courseName",
      })
      .exec();

    if (allReviews.length > 0)
      return res.status(200).json({ success: true, allReviews });
    return res.status(200).json({ success: true, allReviews: [] });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server error while getting all rating and review",
    });
  }
};
