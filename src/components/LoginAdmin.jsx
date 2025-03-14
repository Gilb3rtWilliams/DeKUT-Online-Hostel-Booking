import { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import dekutLogo from "../images/dkutlogo.jpg";
import "../css/LoginAdmin.css";

const LoginAdmin = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      if (!email.endsWith("@dkut.ac.ke")) {
        throw new Error("Invalid admin email");
      }

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data));

      window.location.href = "/admin-dashboard";
    } catch (err) {
      console.error("Login error:", err.response?.data);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Invalid email or password.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBackClick = (e) => {
    e.preventDefault();
    onClose("home");
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
      className="admin-login-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div 
        className="admin-login-form"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.img 
          src={dekutLogo} 
          alt="DeKUT Logo" 
          variants={itemVariants}
        />
        
        <motion.h2 variants={itemVariants}>
          Admin Login
        </motion.h2>

        <motion.div
          className="admin-warning"
          variants={itemVariants}
        >
          <p>⚠️ Restricted Access</p>
          <p>This page is for DeKUT administrative staff only. If you are a student, please use the student login page.</p>
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
        </AnimatePresence>

        <motion.form 
          onSubmit={handleLogin}
          variants={itemVariants}
        >
          <motion.div 
            className="admin-form-group"
            variants={itemVariants}
          >
            <label htmlFor="email">Admin Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your admin email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              pattern=".*@dkut\.ac\.ke"
            />
          </motion.div>
          
          <motion.div 
            className="admin-form-group"
            variants={itemVariants}
          >
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </motion.div>

          <motion.button
            type="submit"
            className="admin-login-button"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? "Logging in..." : "Login"}
          </motion.button>
        </motion.form>

        <motion.div 
          className="admin-notice"
          variants={itemVariants}
        >
          <button 
            onClick={handleBackClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Back to Home
          </button>
        </motion.div>

        <motion.div 
          className="admin-notice"
          variants={itemVariants}
        >
          <p>
            Don't have an account?{" "}
            <button
              onClick={() => onClose("registerAdmin")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Register here
            </button>
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default LoginAdmin;
