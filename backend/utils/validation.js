const Joi = require("joi");

// Hostel Validation
const hostelSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  location: Joi.string().min(3).max(100).required(),
  totalRooms: Joi.number().min(1).required(),
  availableRooms: Joi.number().min(0).required(),
  pricePerRoom: Joi.number().min(0).required(),
  images: Joi.array().items(Joi.string().uri()).optional(),
  gender: Joi.string().valid('male', 'female').required(),
  description: Joi.string().min(10).max(500).required()
});

// Booking Validation
const bookingSchema = Joi.object({
  hostelId: Joi.string().required(),
  roomNumber: Joi.string().required(),
  price: Joi.number().min(0).required(),
  checkInDate: Joi.date().iso().required(),
  checkOutDate: Joi.date().iso().min(Joi.ref('checkInDate')).required(),
  status: Joi.string().valid('Active', 'Pending', 'Approved', 'Cancelled').default('Active')
});

// User Registration Validation
const userSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("student", "admin").required(),
});

module.exports = { hostelSchema, bookingSchema, userSchema };
