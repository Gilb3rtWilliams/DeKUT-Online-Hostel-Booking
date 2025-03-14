const Booking = require("../models/Booking");
const Hostel = require("../models/Hostel");
const sendEmail = require("../utils/emailService");
const { createNotification } = require("./notificationController");
const { bookingSchema } = require("../utils/validation");

// @desc Create a booking
// @route POST /api/bookings
// @access Student
const bookHostel = async (req, res) => {
    try {
      // Validate request body
      const { error } = bookingSchema.validate(req.body);
      if (error) return res.status(400).json({ message: error.details[0].message });
  
      const { hostelId, roomNumber } = req.body;
  
      const hostel = await Hostel.findById(hostelId);
      if (!hostel) return res.status(404).json({ message: "Hostel not found" });
  
      if (hostel.availableRooms <= 0) {
        return res.status(400).json({ message: "No available rooms" });
      }
  
      const booking = new Booking({
        student: req.user._id,
        hostel: hostelId,
        roomNumber,
        status: "Pending",
      });
  
      await booking.save();
      res.status(201).json({ message: "Booking request submitted", booking });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  };

// @desc Approve booking
// @route PUT /api/bookings/:id/approve
// @access Admin
const approveBooking = async (req, res) => {
    try {
      const booking = await Booking.findById(req.params.id).populate("student");
      if (!booking) return res.status(404).json({ message: "Booking not found" });
  
      if (booking.status !== "Pending") {
        return res.status(400).json({ message: "Booking already processed" });
      }
  
      booking.status = "Approved";
      await booking.save();
  
      // Send notification
      await createNotification(booking.student._id, `Your booking for Room ${booking.roomNumber} has been approved.`);
  
      res.json({ message: "Booking approved", booking });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  };

// @desc Cancel booking
// @route DELETE /api/bookings/:id/cancel
// @access Student/Admin
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    await booking.deleteOne();
    await sendEmail(booking.student.email, "Booking Canceled", `Your booking has been canceled.`);

    res.json({ message: "Booking canceled" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// @desc Get all bookings
// @route GET /api/bookings
// @access Admin
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("student", "name email").populate("hostel", "name");
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = { bookHostel, approveBooking, cancelBooking, getAllBookings };
