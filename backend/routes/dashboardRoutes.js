const express = require("express");
const { protect, adminOnly, studentOnly } = require("../middleware/authMiddleware");
const { getAdminDashboard, getStudentDashboard } = require("../controllers/dashboardController");

const router = express.Router();

// 📌 Admin Dashboard Route (Only for Admins)
router.get("/admin", protect, adminOnly, getAdminDashboard);

// 📌 Student Dashboard Route (Only for Students)
router.get("/student", protect, studentOnly, getStudentDashboard);

module.exports = router;
