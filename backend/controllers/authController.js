const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { generateToken, sendVerificationEmail } = require("../config/auth");

// Register User
const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    // Create user with automatic verification in development mode
    const user = await User.create({ 
      name, 
      email, 
      password, 
      role,
      isVerified: process.env.NODE_ENV === 'development' // Auto-verify in development
    });

    // Only send verification email in production
    if (process.env.NODE_ENV !== 'development') {
      const verificationToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1d" });
      await sendVerificationEmail(user.email, verificationToken);
      res.status(201).json({ message: "User registered. Please verify your email." });
    } else {
      res.status(201).json({ message: "User registered successfully. You can now log in." });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Verify Email
const verifyEmail = async (req, res) => {
  const { token } = req.params;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    await User.findByIdAndUpdate(decoded.id, { isVerified: true });
    res.json({ message: "Email verified. You can now log in." });
  } catch (error) {
    res.status(400).json({ message: "Invalid or expired token" });
  }
};

// Login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    // In development mode, always set isVerified to true
    if (process.env.NODE_ENV === 'development') {
      user.isVerified = true;
      await user.save();
    }

    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user.id, user.role),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get User Profile
const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
};

module.exports = { registerUser, verifyEmail, loginUser, getUserProfile };
