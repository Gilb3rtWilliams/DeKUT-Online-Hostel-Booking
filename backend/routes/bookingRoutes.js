const express = require("express");
const { protect, studentOnly, adminOnly } = require("../middleware/authMiddleware");
const { bookHostel } = require("../controllers/bookingController");
const Booking = require("../models/Booking");
const Hostel = require("../models/Hostel");
const sendEmail = require("../utils/emailService");

const router = express.Router(); // ✅ Initialize router first

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
router.post("/", protect, studentOnly, async (req, res) => {
    try {
      const { hostelId, roomNumber } = req.body;
  
      // Find the hostel
      const hostel = await Hostel.findById(hostelId);
      if (!hostel) return res.status(404).json({ message: "Hostel not found" });
  
      // Check if rooms are available
      if (hostel.availableRooms <= 0) {
        return res.status(400).json({ message: "No available rooms in this hostel" });
      }
  
      // Create new booking
      const booking = new Booking({
        student: req.user._id,
        hostel: hostelId,
        roomNumber,
        status: "Pending",
      });
  
      await booking.save();

      // Send email notification to student
      await sendEmail(
        req.user.email,
        "Booking Request Submitted",
        `Your booking request for ${hostel.name}, Room ${roomNumber} has been submitted.`
      );

      res.status(201).json({ message: "Booking request submitted", booking });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
});

// 📌 Approve a booking (Admin Only)
/**
 * @swagger
 * /api/bookings/{id}/approve:
 *   put:
 *     summary: Approve a booking
 *     description: Admins can approve a student's booking request.
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
 *     responses:
 *       200:
 *         description: Booking approved successfully.
 *       400:
 *         description: Booking already processed.
 *       404:
 *         description: Booking not found.
 *       500:
 *         description: Server error.
 */
router.put("/:id/approve", protect, adminOnly, async (req, res) => {
    try {
      const booking = await Booking.findById(req.params.id).populate("student");
      if (!booking) return res.status(404).json({ message: "Booking not found" });

      if (booking.status !== "Pending") {
        return res.status(400).json({ message: "Booking already processed" });
      }

      booking.status = "Approved";
      await booking.save();

      // Send email notification to student
      await sendEmail(
        booking.student.email,
        "Booking Approved",
        `Your booking for Room ${booking.roomNumber} has been approved.`
      );

      res.json({ message: "Booking approved successfully", booking });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
});

// 📌 Cancel a booking
router.delete("/:id/cancel", protect, async (req, res) => {
    try {
      const booking = await Booking.findById(req.params.id).populate("student");
      if (!booking) return res.status(404).json({ message: "Booking not found" });

      await booking.remove();

      // Send email notification to student
      await sendEmail(
        booking.student.email,
        "Booking Canceled",
        `Your booking for Room ${booking.roomNumber} has been canceled.`
      );  

      res.json({ message: "Booking canceled and room availability updated" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
});

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

module.exports = router; // ✅ Export router
