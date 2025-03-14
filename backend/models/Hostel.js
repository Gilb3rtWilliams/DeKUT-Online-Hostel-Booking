const mongoose = require("mongoose");

const hostelSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  location: { type: String, required: true },
  totalRooms: { type: Number, required: true, min: 1 },
  availableRooms: { type: Number, required: true, min: 0 },
  pricePerRoom: { type: Number, required: true, min: 0 },
  images: [{ type: String }],
}, { timestamps: true });  // ✅ Adds createdAt and updatedAt fields

// Reduce availableRooms when a room is booked
hostelSchema.methods.bookRoom = async function () {
    if (this.availableRooms > 0) {
      this.availableRooms -= 1;
      await this.save();
    } else {
      throw new Error("No available rooms left in this hostel.");
    }
  };
  
  // Increase availableRooms when a booking is canceled
  hostelSchema.methods.cancelBooking = async function () {
    if (this.availableRooms < this.totalRooms) {
      this.availableRooms += 1;
      await this.save();
    }
  };

module.exports = mongoose.model("Hostel", hostelSchema);
