import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import dekutLogo from "../images/dkutlogo.jpg";
import "../css/RegisterAdmin.css";

const RegisterAdmin = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    adminID: "",
    profilePicture: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validate email format
    if (!formData.email.endsWith("@dkut.ac.ke")) {
      setError("Please use your DeKUT staff email (@dkut.ac.ke)");
      setLoading(false);
      return;
    }

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      console.log("Sending admin registration request...");
      const { confirmPassword, ...registrationData } = formData;
      
      const response = await axios.post("http://localhost:5000/api/auth/register", {
        ...registrationData,
        role: "admin"
      });

      console.log("Admin registration response:", response.data); // Debug log

      if (response.data.success) {
        console.log("Registration successful");
        onClose("loginAdmin");
      } else {
        setError(response.data.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      console.error("Admin registration error:", err);
      
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError("Registration failed. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <motion.div 
      className="admin-login-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div 
        className="admin-login-form"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <motion.img 
          src={dekutLogo} 
          alt="DeKUT Logo" 
          className="mx-auto w-24 mb-4"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        />
        
        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Admin Registration
        </motion.h2>

        <motion.div
          className="admin-warning"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.35 }}
        >
          <motion.div
            className="bg-yellow-500 bg-opacity-10 border border-yellow-500 border-opacity-30 rounded-lg p-4 text-yellow-400 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <p className="font-medium mb-1">⚠️ Restricted Access</p>
            <p>This registration is for DeKUT administrative staff only.</p>
          </motion.div>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <motion.div 
            className="admin-form-group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </motion.div>

          <motion.div 
            className="admin-form-group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <input
              type="email"
              name="email"
              placeholder="Admin Email"
              value={formData.email}
              onChange={handleChange}
              required
              pattern=".*@dkut\.ac\.ke"
            />
          </motion.div>

          <motion.div 
            className="admin-form-group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <input
              type="text"
              name="adminID"
              placeholder="Admin ID"
              value={formData.adminID}
              onChange={handleChange}
              required
            />
          </motion.div>

          <motion.div 
            className="admin-form-group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </motion.div>

          <motion.div 
            className="admin-form-group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </motion.div>

          <motion.div 
            className="admin-form-group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 1.0 }}
          >
            <input
              type="url"
              name="profilePicture"
              placeholder="Profile Picture URL (Optional)"
              value={formData.profilePicture}
              onChange={handleChange}
            />
          </motion.div>

          {error && (
            <motion.div 
              className="text-red-500 text-sm mt-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {error}
            </motion.div>
          )}

          <motion.button
            type="submit"
            className="admin-login-button"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? "Registering..." : "Register"}
          </motion.button>
        </form>

        <motion.div 
          className="admin-notice"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.1 }}
        >
          <p className="text-gray-400">
            Already have an account?{" "}
            <button
              onClick={() => onClose("loginAdmin")}
              className="text-blue-400 hover:text-blue-300 transition duration-300"
            >
              Login here
            </button>
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default RegisterAdmin; 