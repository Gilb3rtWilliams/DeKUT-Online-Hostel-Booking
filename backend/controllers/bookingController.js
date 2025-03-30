const Booking = require("../models/Booking");
const Hostel = require("../models/Hostel");
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
  
      const { hostelId, roomNumber, price, checkInDate, checkOutDate, status } = req.body;
  
      const hostel = await Hostel.findById(hostelId);
      if (!hostel) return res.status(404).json({ message: "Hostel not found" });
  
      if (hostel.availableRooms <= 0) {
        return res.status(400).json({ message: "No available rooms" });
      }
  
      const booking = new Booking({
        student: req.user._id,
        hostel: hostelId,
        roomNumber,
        price,
        checkInDate,
        checkOutDate,
        status: "Pending" // Set initial status to Pending
      });
  
      await booking.save();

      // Create notification for admin
      await createNotification(
        req.user._id,
        `New booking request for ${hostel.name}, Room ${roomNumber}`
      );

      res.status(201).json({ 
        message: "Booking request submitted successfully", 
        booking 
      });
    } catch (error) {
      console.error("Booking error:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };

// @desc Update booking status
// @route PUT /api/bookings/:id/approve
// @access Admin
const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const booking = await Booking.findById(id).populate('hostel');
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Update booking status
    booking.status = status;
    await booking.save();

    // If approved, update hostel's available rooms
    if (status === "Approved") {
      booking.hostel.availableRooms -= 1;
      await booking.hostel.save();
    }

    // Create notification for student
    await createNotification(
      booking.student,
      `Your booking for ${booking.hostel.name}, Room ${booking.roomNumber} has been ${status.toLowerCase()}`
    );

    res.json({ 
      message: `Booking ${status.toLowerCase()} successfully`,
      booking 
    });
  } catch (error) {
    console.error("Update booking status error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc Cancel booking
// @route DELETE /api/bookings/:id/cancel
// @access Student/Admin
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('hostel');
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // Update hostel's available rooms
    booking.hostel.availableRooms += 1;
    await booking.hostel.save();

    await booking.deleteOne();

    // Create notification
    await createNotification(
      req.user._id,
      `Your booking for ${booking.hostel.name}, Room ${booking.roomNumber} has been canceled.`
    );

    res.json({ message: "Booking canceled successfully" });
  } catch (error) {
    console.error("Cancel booking error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { bookHostel, cancelBooking, updateBookingStatus };
