const express = require("express");
const { protect, studentOnly } = require("../middleware/authMiddleware");
const { getStudentProfile, updateStudentProfile } = require("../controllers/studentController");

const router = express.Router();

// Get logged-in student profile
router.get("/profile", protect, studentOnly, getStudentProfile);

// Update student profile
router.put("/profile", protect, studentOnly, updateStudentProfile);

module.exports = router;
