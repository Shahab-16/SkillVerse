const express = require("express");
const router = express.Router();
const mailSender = require("../utils/mailSender");

exports.contactUs = async (req, res) => {
  const { email, firstName, lastName, message, phoneNumber, countryCode } =
    req.body;
  try {
    if (
      !email ||
      !firstName ||
      !lastName ||
      !message ||
      !phoneNumber ||
      !countryCode
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    const mailResponse = await mailSender(email, "Mail sent successfully", {
      firstName: firstName,
      lastName: lastName,
      message: message,
      phoneNumber: phoneNumber,
      countryCode: countryCode,
    });
    return res.status(200).json({
      success: true,
      message: "Mail sent successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
