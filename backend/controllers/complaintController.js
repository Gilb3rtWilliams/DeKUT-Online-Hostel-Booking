const Complaint = require("../models/Complaint");

// @desc Submit a complaint
// @route POST /api/complaints
// @access Student
const submitComplaint = async (req, res) => {
  try {
    const { subject, description } = req.body;

    if (!subject || !description) {
      return res.status(400).json({ message: "Subject and description are required" });
    }

    const complaint = await Complaint.create({
      student: req.user._id,
      subject,
      description,
    });

    res.status(201).json({ message: "Complaint submitted successfully", complaint });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// @desc Get all complaints (Admin Only)
// @route GET /api/complaints
// @access Admin
const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find().populate("student", "name email");
    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// @desc Get a single complaint
// @route GET /api/complaints/:id
// @access Admin
const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id).populate("student", "name email");

    if (!complaint) return res.status(404).json({ message: "Complaint not found" });

    res.status(200).json(complaint);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// @desc Mark complaint as resolved
// @route PUT /api/complaints/:id/resolve
// @access Admin
const resolveComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: "Complaint not found" });

    complaint.status = "Resolved";
    await complaint.save();

    res.json({ message: "Complaint resolved", complaint });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = { submitComplaint, getAllComplaints, getComplaintById, resolveComplaint };
