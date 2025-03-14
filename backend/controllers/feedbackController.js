const Feedback = require("../models/Feedback");

// @desc Submit feedback
// @route POST /api/feedback
// @access Student
const submitFeedback = async (req, res) => {
  try {
    const { message, rating } = req.body;

    if (!message || !rating) {
      return res.status(400).json({ message: "Message and rating are required" });
    }

    const feedback = await Feedback.create({
      student: req.user._id,
      message,
      rating,
    });

    res.status(201).json({ message: "Feedback submitted successfully", feedback });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// @desc Get all feedback (Admin Only)
// @route GET /api/feedback
// @access Admin
const getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().populate("student", "name email");
    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = { submitFeedback, getAllFeedback };
