import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaEdit, FaSave } from 'react-icons/fa';
import '../../css/Profile.css';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    regNumber: '',
    phoneNumber: '',
    yearOfStudy: '',
    course: ''
  });

  useEffect(() => {
    // Load user data from localStorage or API
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setUserData(user);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Add your update profile logic here
    setIsEditing(false);
  };

  return (
    <motion.div
      className="profile-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="profile-header">
        <h2>My Profile</h2>
        <button 
          className="edit-button"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? <FaSave /> : <FaEdit />}
          {isEditing ? ' Save' : ' Edit'}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-grid">
          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              value={userData.firstName}
              onChange={(e) => setUserData({...userData, firstName: e.target.value})}
              disabled={!isEditing}
            />
          </div>

          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              value={userData.lastName}
              onChange={(e) => setUserData({...userData, lastName: e.target.value})}
              disabled={!isEditing}
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={userData.email}
              disabled={true}
            />
          </div>

          <div className="form-group">
            <label>Registration Number</label>
            <input
              type="text"
              value={userData.regNumber}
              disabled={true}
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              value={userData.phoneNumber}
              onChange={(e) => setUserData({...userData, phoneNumber: e.target.value})}
              disabled={!isEditing}
            />
          </div>

          <div className="form-group">
            <label>Year of Study</label>
            <select
              value={userData.yearOfStudy}
              onChange={(e) => setUserData({...userData, yearOfStudy: e.target.value})}
              disabled={!isEditing}
            >
              <option value="">Select Year</option>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
            </select>
          </div>

          <div className="form-group">
            <label>Course</label>
            <input
              type="text"
              value={userData.course}
              onChange={(e) => setUserData({...userData, course: e.target.value})}
              disabled={!isEditing}
            />
          </div>
        </div>

        {isEditing && (
          <div className="button-group">
            <button type="submit" className="save-button">
              Save Changes
            </button>
            <button 
              type="button" 
              className="cancel-button"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </div>
        )}
      </form>
    </motion.div>
  );
};

export default Profile;
