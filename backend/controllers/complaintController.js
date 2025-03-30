const Complaint = require("../models/Complaint");
const { createNotification } = require('./notificationController');

// @desc Create a new complaint
// @route POST /api/complaints
// @access Student
const createComplaint = async (req, res) => {
  try {
    const { title, description, category, priority } = req.body;

    const complaint = new Complaint({
      student: req.user._id,
      title,
      description,
      category,
      priority
    });

    await complaint.save();

    // Create notification for admin
    await createNotification(
      req.user._id,
      `New complaint submitted: ${title}`
    );

    res.status(201).json({
      message: 'Complaint submitted successfully',
      complaint
    });
  } catch (error) {
    console.error('Create complaint error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc Get all complaints (Admin)
// @route GET /api/complaints
// @access Admin
const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate('student', 'name email')
      .populate('replies.admin', 'name')
      .sort({ createdAt: -1 });

    res.json(complaints);
  } catch (error) {
    console.error('Get complaints error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc Get student's complaints
// @route GET /api/complaints/student
// @access Student
const getStudentComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ student: req.user._id })
      .populate('replies.admin', 'name')
      .sort({ createdAt: -1 });

    res.json(complaints);
  } catch (error) {
    console.error('Get student complaints error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc Add reply to complaint
// @route POST /api/complaints/:id/reply
// @access Admin
const addReply = async (req, res) => {
  try {
    const { message } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    complaint.replies.push({
      message,
      admin: req.user._id
    });

    // Update status to resolved if admin marks it as resolved
    if (req.body.status === 'resolved') {
      complaint.status = 'resolved';
    }

    await complaint.save();

    // Create notification for student
    await createNotification(
      complaint.student,
      `Your complaint "${complaint.title}" has been updated`
    );

    res.json({
      message: 'Reply added successfully',
      complaint
    });
  } catch (error) {
    console.error('Add reply error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc Update complaint status
// @route PUT /api/complaints/:id/status
// @access Admin
const updateComplaintStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    complaint.status = status;
    await complaint.save();

    // Create notification for student
    await createNotification(
      complaint.student,
      `Your complaint "${complaint.title}" status has been updated to ${status}`
    );

    res.json({
      message: 'Complaint status updated successfully',
      complaint
    });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createComplaint,
  getAllComplaints,
  getStudentComplaints,
  addReply,
  updateComplaintStatus
};
