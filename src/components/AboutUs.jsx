import React from 'react';
import { motion } from 'framer-motion';
import '../css/AboutUs.css';

function AboutUs() {
  return (
    <div className="about-container">
      <motion.div
        className="about-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2>About DeKUT Hostels</h2>
        
        <div className="about-section">
          <h3>Our Mission</h3>
          <p>
            To provide safe, comfortable, and affordable accommodation for DeKUT students while fostering a conducive learning environment.
          </p>
          
          <h3>Our Vision</h3>
          <p>
            To be the leading student accommodation provider in the region, known for excellence in service and student welfare.
          </p>
          
          <h3>Our Values</h3>
          <ul className="features-list">
            <li>Student Safety and Security</li>
            <li>Quality Living Standards</li>
            <li>Environmental Sustainability</li>
            <li>Community Building</li>
            <li>Innovation and Excellence</li>
          </ul>
        </div>
        
        <div className="about-section">
          <h3>Our History</h3>
          <p>
            Established in 2010, DeKUT Hostels has been serving the student community for over a decade. We've grown from a single building to a comprehensive housing solution for thousands of students.
          </p>
          
          <h3>Our Facilities</h3>
          <ul className="features-list">
            <li>Modern Security Systems</li>
            <li>24/7 Maintenance Support</li>
            <li>Study Areas and Common Rooms</li>
            <li>Sports and Recreation Facilities</li>
            <li>Medical Emergency Response</li>
          </ul>
          
          <h3>Our Commitment</h3>
          <p>
            We are committed to providing a home away from home for our students, ensuring their comfort and academic success through our comprehensive support services.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default AboutUs;