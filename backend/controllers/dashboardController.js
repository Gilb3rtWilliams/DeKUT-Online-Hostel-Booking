const Booking = require("../models/Booking");
const Hostel = require("../models/Hostel");
const User = require("../models/User");

// 📌 Admin Dashboard: Get all relevant details
const getAdminDashboard = async (req, res) => {
    try {
        const totalBookings = await Booking.countDocuments();
        const pendingBookings = await Booking.countDocuments({ status: "Pending" });
        const totalHostels = await Hostel.countDocuments();
        const totalUsers = await User.countDocuments();
        const recentBookings = await Booking.find()
            .populate("student", "name email")
            .populate("hostel", "name location")
            .sort({ createdAt: -1 })
            .limit(5);

        res.json({
            totalBookings,
            pendingBookings,
            totalHostels,
            totalUsers,
            recentBookings
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// 📌 Student Dashboard: Get the student's bookings
const getStudentDashboard = async (req, res) => {
    try {
        const studentBookings = await Booking.find({ student: req.user._id })
            .populate("hostel", "name location")
            .sort({ createdAt: -1 });

        res.json({ studentBookings });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

module.exports = { getAdminDashboard, getStudentDashboard };
