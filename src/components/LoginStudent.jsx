import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import dekutLogo from "../images/dkutlogo.jpg";
import "../css/LoginStudent.css";

const LoginStudent = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    const savedPassword = localStorage.getItem("rememberedPassword");
    const savedRememberMe = localStorage.getItem("rememberMe") === "true";

    if (savedEmail && savedPassword && savedRememberMe) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      if (!email.endsWith("@students.dkut.ac.ke")) {
        throw new Error("Invalid student email");
      }

      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
        localStorage.setItem("rememberedPassword", password);
        localStorage.setItem("rememberMe", "true");
      } else {
        localStorage.removeItem("rememberedEmail");
        localStorage.removeItem("rememberedPassword");
        localStorage.removeItem("rememberMe");
      }

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data));

      window.location.href = "/student-dashboard";
    } catch (err) {
      console.error("Login error:", err.response?.data);
      
      if (err.response?.status === 403) {
        setError("Please verify your email before logging in. Check your inbox for the verification link.");
        setVerificationSent(true);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Invalid email or password.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterClick = (e) => {
    e.preventDefault();
    onClose("register");
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
      className="login-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div 
        className="login-form"
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
          Student Login
        </motion.h2>

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
              {verificationSent && (
                <motion.p 
                  className="mt-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Didn't receive the email? Check your spam folder or{" "}
                  <motion.button 
                    onClick={() => onClose("register")} 
                    className="text-blue-400 hover:text-blue-300 underline"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    register again
                  </motion.button>
                </motion.p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.form 
          onSubmit={handleLogin}
          variants={itemVariants}
        >
          <motion.div 
            className="form-group"
            variants={itemVariants}
          >
            <label htmlFor="email">Student Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your student email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              pattern=".*@students\.dkut\.ac\.ke"
            />
          </motion.div>
          
          <motion.div 
            className="form-group"
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

          <motion.div 
            className="remember-forgot"
            variants={itemVariants}
          >
            <div className="remember-me">
              <input 
                type="checkbox" 
                id="remember" 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="remember">Remember me</label>
            </div>
            <a href="#" className="forgot-password">Forgot Password?</a>
          </motion.div>

          <motion.button
            type="submit"
            className="login-button"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? "Logging in..." : "Login"}
          </motion.button>
        </motion.form>

        <motion.div 
          className="register-link"
          variants={itemVariants}
        >
          Don't have an account?{" "}
          <motion.a 
            href="#" 
            onClick={handleRegisterClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Register here
          </motion.a>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default LoginStudent;
