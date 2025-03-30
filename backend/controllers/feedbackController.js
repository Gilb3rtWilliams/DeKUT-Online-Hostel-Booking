const Feedback = require("../models/Feedback");
const { createNotification } = require('./notificationController');

// @desc Create new feedback
// @route POST /api/feedback
// @access Student
const createFeedback = async (req, res) => {
  try {
    const { rating, cleanliness, maintenance, security, facilities, comment } = req.body;

    const feedback = new Feedback({
      student: req.user._id,
      rating,
      cleanliness,
      maintenance,
      security,
      facilities,
      comment
    });

    await feedback.save();

    // Create notification for admin
    await createNotification(
      req.user._id,
      `New feedback submitted with rating: ${rating}/5`
    );

    res.status(201).json({
      message: 'Feedback submitted successfully',
      feedback
    });
  } catch (error) {
    console.error('Create feedback error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc Get all feedback (Admin)
// @route GET /api/feedback
// @access Admin
const getAllFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find()
      .populate('student', 'name email')
      .populate('response.admin', 'name')
      .sort({ createdAt: -1 });

    res.json(feedback);
  } catch (error) {
    console.error('Get feedback error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc Get student's feedback
// @route GET /api/feedback/student
// @access Student
const getStudentFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find({ student: req.user._id })
      .populate('response.admin', 'name')
      .sort({ createdAt: -1 });

    res.json(feedback);
  } catch (error) {
    console.error('Get student feedback error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc Add admin response to feedback
// @route POST /api/feedback/:id/response
// @access Admin
const addResponse = async (req, res) => {
  try {
    const { message } = req.body;
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    feedback.response = {
      message,
      admin: req.user._id,
      date: new Date()
    };

    await feedback.save();

    // Create notification for student
    await createNotification(
      feedback.student,
      'Admin has responded to your feedback'
    );

    res.json({
      message: 'Response added successfully',
      feedback
    });
  } catch (error) {
    console.error('Add response error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc Update feedback status
// @route PUT /api/feedback/:id/status
// @access Admin
const updateFeedbackStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    feedback.status = status;
    await feedback.save();

    // Create notification for student if status changes
    if (status === 'published' || status === 'hidden') {
      await createNotification(
        feedback.student,
        `Your feedback has been ${status}`
      );
    }

    res.json({
      message: 'Feedback status updated successfully',
      feedback
    });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createFeedback,
  getAllFeedback,
  getStudentFeedback,
  addResponse,
  updateFeedbackStatus
};
