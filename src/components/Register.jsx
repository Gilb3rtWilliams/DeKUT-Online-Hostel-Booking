import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import dekutLogo from "../images/dkutlogo.jpg";
import "../css/Register.css";

function Register({ onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    studentID: "",
    profilePicture: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (!formData.email.endsWith("@students.dkut.ac.ke")) {
      setError("Please use your DeKUT student email (@students.dkut.ac.ke)");
      setLoading(false);
      return;
    }

    try {
      const { confirmPassword, ...registrationData } = formData;
      
      const response = await axios.post("http://localhost:5000/api/students/register", {
        ...registrationData,
        role: "student"
      });

      if (response.data) {
        setSuccess("Registration successful! Please check your email to verify your account.");
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          studentID: "",
          profilePicture: ""
        });
      }
    } catch (err) {
      console.error("Registration error:", err);
      
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
      [e.target.name]: e.target.value
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <motion.div
      className="register-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div 
        className="register-form"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="register-header"
          variants={itemVariants}
        >
          <motion.img 
            src={dekutLogo} 
            alt="DeKUT Logo"
            variants={itemVariants}
          />
          <motion.h2 variants={itemVariants}>
            Student Registration
          </motion.h2>
          <motion.p variants={itemVariants}>
            Create your account to book hostel accommodation
          </motion.p>
        </motion.div>

        <AnimatePresence>
          {error && (
            <motion.div
              className="error-message"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {error}
            </motion.div>
          )}
          
          {success && (
            <motion.div
              className="success-message"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {success}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.form 
          onSubmit={handleSubmit}
          variants={itemVariants}
        >
          <motion.h3 
            className="section-header"
            variants={itemVariants}
          >
            Personal Information
          </motion.h3>

          <motion.div 
            className="form-grid"
            variants={itemVariants}
          >
            <motion.div 
              className="form-group"
              variants={itemVariants}
            >
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
                minLength="2"
              />
            </motion.div>
            <motion.div 
              className="form-group"
              variants={itemVariants}
            >
              <label htmlFor="studentID">Student ID</label>
              <input
                type="text"
                id="studentID"
                name="studentID"
                value={formData.studentID}
                onChange={handleChange}
                required
                placeholder="Enter your student ID"
                pattern="[A-Z0-9]+"
              />
            </motion.div>
          </motion.div>

          <motion.h3 
            className="section-header"
            variants={itemVariants}
          >
            Contact Information
          </motion.h3>

          <motion.div 
            className="form-grid"
            variants={itemVariants}
          >
            <motion.div 
              className="form-group"
              variants={itemVariants}
            >
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="username@students.dkut.ac.ke"
                pattern="[a-zA-Z0-9._%+-]+@students\.dkut\.ac\.ke"
              />
            </motion.div>
            <motion.div 
              className="form-group"
              variants={itemVariants}
            >
              <label htmlFor="profilePicture">Profile Picture URL (Optional)</label>
              <input
                type="url"
                id="profilePicture"
                name="profilePicture"
                value={formData.profilePicture}
                onChange={handleChange}
                placeholder="https://example.com/profile.jpg"
              />
            </motion.div>
          </motion.div>

          <motion.h3 
            className="section-header"
            variants={itemVariants}
          >
            Security
          </motion.h3>

          <motion.div 
            className="form-grid"
            variants={itemVariants}
          >
            <motion.div 
              className="form-group"
              variants={itemVariants}
            >
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength="6"
                placeholder="Enter your password"
              />
            </motion.div>
            <motion.div 
              className="form-group"
              variants={itemVariants}
            >
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength="6"
                placeholder="Confirm your password"
              />
            </motion.div>
          </motion.div>

          <motion.button 
            type="submit" 
            className="register-button"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? "Registering..." : "Create Account"}
          </motion.button>

          <motion.div 
            className="login-link"
            variants={itemVariants}
          >
            Already have an account?{" "}
            <motion.button 
              type="button" 
              onClick={() => onClose("loginStudent")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Login here
            </motion.button>
          </motion.div>
        </motion.form>
      </motion.div>
    </motion.div>
  );
}

export default Register;