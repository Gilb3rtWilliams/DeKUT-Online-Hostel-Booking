const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  cleanliness: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  maintenance: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  security: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  facilities: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'published', 'hidden'],
    default: 'pending'
  },
  response: {
    message: String,
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    date: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Feedback", feedbackSchema);
