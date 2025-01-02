const section = require("../models/Section");
const subsection = require("../models/SubSection");
const mongoose = require("mongoose");
const { uploadToCloudinary } = require("../utils/uploadToCloudinary");

exports.createSubSection = async (req, res) => {
  try {
    const { sectionId, title, description } = req.body;
    const video = req.files.video;

    if (!sectionId || !title || !description || !video) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    console.log(video);

    const uploadDetails = await uploadToCloudinary(
      video,
      process.env.FolderName
    );
    console.log(uploadDetails);

    const subSectionDetails = await subsection.create({
      title: title,
      timeDuration: `${uploadDetails.duration}`,
      description: description,
      videoURL: uploadDetails.secure_url,
    });

    const updatedSection = await section
      .findByIdAndUpdate(sectionId, {
        $push: { subSection: subSectionDetails._id },
      })
      .populate("subSection");
    return res.status(200).json({
      success: true,
      message: "SubSection created successfully",
      data: subSectionDetails,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server error while creating SubSection",
    });
  }
};

exports.updateSubSection = async (req, res) => {
  try {
    const { sectionId, subSectionId, title, description } = req.body;

    const SubSection = await subsection.findById(subSectionId);

    if (!SubSection) {
      return res.status(400).json({
        success: false,
        message: "SubSection not found",
      });
    }

    if (title !== undefined) {
      SubSection.title = title;
    }

    if (description !== undefined) {
      SubSection.description = description;
    }

    if (req.files && req.files.video !== undefined) {
      const video = req.files.video;
      const uploadDetails = await uploadToCloudinary(
        video,
        process.env.FolderName
      );

      SubSection.videoURL = uploadDetails.secure_url;
      SubSection.timeDuration = `${uploadDetails.duration}`;
    }

    await SubSection.save();

    const updatedSection = await section
      .findById(sectionId)
      .populate("subSection");

    return res.status(200).json({
      success: true,
      message: "SubSection updated successfully",
      data: updatedSection,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server error while updating SubSection",
    });
  }
};

exports.deleteSubSection = async (req, res) => {
  try {
    const { sectionId, subSectionId, courseId } = req.body;

    const SubSection = await subsection.findById(subSectionId);

    if (!SubSection) {
      return res.status(400).json({
        success: false,
        message: "SubSection not found",
      });
    }

    await section.findByIdAndUpdate(sectionId, {
      $pull: { subSection: subSectionId },
    });
    await subsection.findByIdAndDelete(subSectionId);

    const updatedSection = await section
      .findById(sectionId)
      .populate("subSection");  

    return res.status(200).json({
      success: true,
      message: "SubSection deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server error while deleting SubSection",
    });
  }
};
