const User = require("../models/User");
const Booking = require("../models/Booking");
const Complaint = require("../models/Complaint");
const Feedback = require("../models/Feedback");

// Get all students with bookings
const getAllStudents = async (req, res) => {
  try {
    // Get all bookings with populated student data
    const bookings = await Booking.find()
      .populate("student", "-password")
      .populate("hostel", "name location");

    // Get unique students from bookings
    const uniqueStudents = bookings.reduce((acc, booking) => {
      const studentId = booking.student._id.toString();
      if (!acc[studentId]) {
        acc[studentId] = {
          ...booking.student.toObject(),
          bookings: []
        };
      }
      acc[studentId].bookings.push(booking);
      return acc;
    }, {});

    // Convert to array and sort by name
    const students = Object.values(uniqueStudents).sort((a, b) => 
      a.name.localeCompare(b.name)
    );

    res.status(200).json(students);
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete a student
const deleteStudent = async (req, res) => {
  try {
    const student = await User.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    await student.deleteOne();
    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get all hostel bookings
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("student hostel");
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get all complaints
const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find().populate("student");
    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get all feedback
const getAllFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find().populate("student");
    res.status(200).json(feedback);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getAllStudents,
  deleteStudent,
  getAllBookings,
  getAllComplaints,
  getAllFeedback,
};
