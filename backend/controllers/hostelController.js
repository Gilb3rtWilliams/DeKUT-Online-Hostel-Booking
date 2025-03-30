const Hostel = require("../models/Hostel");
const { hostelSchema } = require("../utils/validation");

// @desc Get all hostels
// @route GET /api/hostels
// @access Public
const getHostels = async (req, res) => {
  try {
    const hostels = await Hostel.find();
    res.json(hostels);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// @desc Get a single hostel
// @route GET /api/hostels/:id
// @access Public
const getHostelById = async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.id);
    if (!hostel) return res.status(404).json({ message: "Hostel not found" });
    res.json(hostel);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// @desc Add a new hostel
// @route POST /api/hostels
// @access Admin

const addHostel = async (req, res) => {
    try {
      // Validate request body
      const { error } = hostelSchema.validate(req.body);
      if (error) return res.status(400).json({ message: error.details[0].message });
  
      const { name, location, totalRooms, availableRooms, pricePerRoom, images, gender, description } = req.body;
  
      const hostelExists = await Hostel.findOne({ name });
      if (hostelExists) return res.status(400).json({ message: "Hostel already exists" });
  
      const hostel = new Hostel({ 
        name, 
        location, 
        totalRooms, 
        availableRooms, 
        pricePerRoom, 
        images,
        gender,
        description
      });
      await hostel.save();
  
      res.status(201).json({ message: "Hostel added successfully", hostel });
    } catch (error) {
      console.error('Error adding hostel:', error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };

// @desc Update a hostel
// @route PUT /api/hostels/:id
// @access Admin
const updateHostel = async (req, res) => {
  try {
    const { name, location, totalRooms, availableRooms, pricePerRoom, images } = req.body;

    const hostel = await Hostel.findById(req.params.id);
    if (!hostel) return res.status(404).json({ message: "Hostel not found" });

    hostel.name = name || hostel.name;
    hostel.location = location || hostel.location;
    hostel.totalRooms = totalRooms || hostel.totalRooms;
    hostel.availableRooms = availableRooms || hostel.availableRooms;
    hostel.pricePerRoom = pricePerRoom || hostel.pricePerRoom;
    hostel.images = images || hostel.images;

    await hostel.save();
    res.json({ message: "Hostel updated successfully", hostel });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// @desc Delete a hostel
// @route DELETE /api/hostels/:id
// @access Admin
const deleteHostel = async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.id);
    if (!hostel) return res.status(404).json({ message: "Hostel not found" });

    await hostel.deleteOne();
    res.json({ message: "Hostel deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = {
    getHostels,
    getHostelById,
    addHostel,
    updateHostel,
    deleteHostel,
  };
  
