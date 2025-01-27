const express = require("express");
const router = express.Router();
const section = require("../models/Section");
const subSection = require("../models/SubSection");
const courseProgress = require("../models/CourseProgress");
const course = require("../models/Courses");

exports.CourseProgress = async (req, res) => {
  try {
    const { courseId, subSection } = req.body;
    const userId = req.body.userId;
    const completedVideos = req.body.completedVideos;

    const subSectionDetails = await subSection.findById(subSection);
    if (!subSectionDetails) {
      return res.status(400).json({
        success: false,
        message: "Subsection not found",
      });
    }

    let courseProgressDetails = await courseProgress.findOne({
      courseId,
      userId,
    });

    if (!courseProgressDetails) {
      return res.status(400).json({
        success: false,
        message: "Course progress not found",
      });
    } else {
      if (courseProgressDetails.completedVideos.includes(subSection)) {
        return res.status(400).json({
          success: false,
          message: "Video already completed",
        });
      }
      courseProgressDetails.completedVideos.push(subSection);
      await courseProgressDetails.save();
      return res.status(200).json({
        success: true,
        message: "Video completed successfully",
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
