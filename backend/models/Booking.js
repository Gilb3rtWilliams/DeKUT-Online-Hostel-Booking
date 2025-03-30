const mongoose = require("mongoose");
const Hostel = require("./Hostel");

const bookingSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  hostel: { type: mongoose.Schema.Types.ObjectId, ref: "Hostel", required: true },
  roomNumber: { type: String, required: true },
  price: { type: Number, required: true },
  checkInDate: { type: Date, required: true },
  checkOutDate: { type: Date, required: true },
  status: { type: String, enum: ["Active", "Pending", "Approved", "Cancelled"], default: "Active" }
}, { timestamps: true });  // ✅ Adds createdAt and updatedAt fields


// Middleware: Reduce available rooms when a booking is approved
bookingSchema.post("save", async function (doc, next) {
    if (doc.status === "Approved") {
      try {
        const hostel = await Hostel.findById(doc.hostel);
        await hostel.bookRoom();
      } catch (error) {
        return next(error);
      }
    }
    next();
  });
  
  // Middleware: Increase available rooms when a booking is canceled
bookingSchema.post("remove", async function (doc, next) {
    try {
      const hostel = await Hostel.findById(doc.hostel);
      await hostel.cancelBooking();
    } catch (error) {
      return next(error);
    }
    next();
  });

module.exports = mongoose.model("Booking", bookingSchema);
