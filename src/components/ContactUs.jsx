import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaPaperPlane } from 'react-icons/fa';
import '../css/ContactUs.css';

function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
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
    <div className="contact-container">
      <motion.div
        className="contact-content"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="contact-header" variants={itemVariants}>
          <h2>Get in Touch</h2>
          <p>Have questions about our hostel facilities? We're here to help. Send us a message and we'll respond as soon as possible.</p>
        </motion.div>

        <div className="contact-grid">
          <motion.div className="contact-info-section" variants={itemVariants}>
            <motion.div className="info-item" variants={itemVariants}>
              <div className="icon-wrapper">
                <FaMapMarkerAlt />
              </div>
              <h3>Our Location</h3>
              <p>Dedan Kimathi University of Technology<br />Nyeri, Kenya</p>
            </motion.div>

            <motion.div className="info-item" variants={itemVariants}>
              <div className="icon-wrapper">
                <FaPhone />
              </div>
              <h3>Phone Number</h3>
              <p>+254 123 456 789</p>
            </motion.div>

            <motion.div className="info-item" variants={itemVariants}>
              <div className="icon-wrapper">
                <FaEnvelope />
              </div>
              <h3>Email Address</h3>
              <p>info@dekuthostels.com</p>
            </motion.div>

            <motion.div className="info-item" variants={itemVariants}>
              <div className="icon-wrapper">
                <FaClock />
              </div>
              <h3>Office Hours</h3>
              <p>Monday - Friday: 8:00 AM - 5:00 PM<br />Saturday: 9:00 AM - 1:00 PM</p>
            </motion.div>
          </motion.div>

          <motion.div className="contact-form-section" variants={itemVariants}>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Your Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Enter message subject"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Enter your message"
                  rows="5"
                  required
                ></textarea>
              </div>

              <motion.button
                type="submit"
                className="submit-button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>Send Message</span>
                <FaPaperPlane />
              </motion.button>
            </form>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default ContactUs;