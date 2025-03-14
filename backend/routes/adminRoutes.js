const express = require("express");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const {
  getAllStudents,
  deleteStudent,
  getAllBookings,
  getAllComplaints,
  getAllFeedback,
} = require("../controllers/adminController");

const router = express.Router();

router.get("/admin/dashboard", protect, adminOnly, (req, res) => {
  res.json({ message: "Welcome, Admin!" });
});

// Manage Students
router.get("/students", protect, adminOnly, getAllStudents);
router.delete("/students/:id", protect, adminOnly, deleteStudent);

// View All Bookings
router.get("/bookings", protect, adminOnly, getAllBookings);

// View All Complaints
router.get("/complaints", protect, adminOnly, getAllComplaints);

// View All Feedback
router.get("/feedback", protect, adminOnly, getAllFeedback);

module.exports = router;
