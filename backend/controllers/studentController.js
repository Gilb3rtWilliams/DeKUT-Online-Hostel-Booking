const User = require("../models/User");

// @desc Get student profile
// @route GET /api/students/profile
// @access Private (Student only)
const getStudentProfile = async (req, res) => {
  try {
    const student = await User.findById(req.user._id).select("-password");
    if (!student) return res.status(404).json({ message: "Student not found" });

    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update student profile
// @route PUT /api/students/profile
// @access Private (Student only)
const updateStudentProfile = async (req, res) => {
  try {
    const student = await User.findById(req.user._id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    // Update fields
    student.name = req.body.name || student.name;
    student.email = req.body.email || student.email;

    // Save updated student
    const updatedStudent = await student.save();
    res.status(200).json(updatedStudent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getStudentProfile, updateStudentProfile };
