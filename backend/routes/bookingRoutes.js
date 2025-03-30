const express = require("express");
const { protect, studentOnly, adminOnly } = require("../middleware/authMiddleware");
const { bookHostel, cancelBooking, updateBookingStatus } = require("../controllers/bookingController");
const Booking = require("../models/Booking");
const Hostel = require("../models/Hostel");

const router = express.Router();

// 📌 Create a new booking (Student Only)
/**
 * @swagger
 * /api/bookings:
 *   post:
 *     summary: Book a hostel room
 *     description: Students can book a hostel room.
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               hostelId:
 *                 type: string
 *               roomNumber:
 *                 type: string
 *     responses:
 *       201:
 *         description: Booking request submitted.
 *       400:
 *         description: Invalid input.
 *       500:
 *         description: Server error.
 */
router.post("/", protect, studentOnly, bookHostel);

// 📌 Get student's bookings
router.get("/student", protect, studentOnly, async (req, res) => {
  try {
    const bookings = await Booking.find({ student: req.user._id })
      .populate("hostel", "name location gender")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    console.error("Error fetching student bookings:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// 📌 Update booking status (Admin Only)
/**
 * @swagger
 * /api/bookings/{id}/status:
 *   put:
 *     summary: Update booking status
 *     description: Admins can update a booking's status (approve/reject).
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Booking ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Approved, Rejected]
 *     responses:
 *       200:
 *         description: Booking status updated successfully.
 *       400:
 *         description: Invalid status.
 *       404:
 *         description: Booking not found.
 *       500:
 *         description: Server error.
 */
router.put("/:id/status", protect, adminOnly, updateBookingStatus);

// 📌 Cancel a booking
router.delete("/:id/cancel", protect, cancelBooking);

// 📌 Get all bookings (Admin Only)
router.get("/", protect, adminOnly, async (req, res) => {
    try {
      const bookings = await Booking.find()
        .populate("student", "name email")
        .populate("hostel", "name location");

      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
});

module.exports = router;
