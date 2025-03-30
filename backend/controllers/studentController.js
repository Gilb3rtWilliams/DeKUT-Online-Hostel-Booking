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
    student.phoneNumber = req.body.phoneNumber || student.phoneNumber;
    student.yearOfStudy = req.body.yearOfStudy || student.yearOfStudy;
    student.course = req.body.course || student.course;

    // Save updated student
    const updatedStudent = await student.save();
    
    // Return updated student without password
    const studentResponse = updatedStudent.toObject();
    delete studentResponse.password;
    
    res.status(200).json(studentResponse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getStudentProfile, updateStudentProfile };
