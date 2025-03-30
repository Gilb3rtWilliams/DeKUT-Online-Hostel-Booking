import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaUserGraduate, FaBan, FaCheck, FaEnvelope } from 'react-icons/fa';
import '../../css/ManageStudents.css';

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [emailContent, setEmailContent] = useState({
    subject: '',
    message: ''
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('http://localhost:5000/api/students', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch students');
      }

      const studentsData = await response.json();
      setStudents(studentsData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching students:', error);
      setLoading(false);
    }
  };

  const handleStatusChange = async (studentId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`http://localhost:5000/api/students/${studentId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error('Failed to update student status');
      }

      // Update local state
      setStudents(students.map(student => 
        student._id === studentId 
          ? { ...student, status: newStatus }
          : student
      ));
    } catch (error) {
      console.error('Error updating student status:', error);
    }
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('http://localhost:5000/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          recipient: selectedStudent._id,
          type: 'email',
          title: emailContent.subject,
          message: emailContent.message
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send email');
      }

      setShowEmailModal(false);
      setEmailContent({ subject: '', message: '' });
      setSelectedStudent(null);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.regNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || student.status === filter;
    return matchesSearch && matchesFilter;
  });

  const getCurrentBooking = (student) => {
    return student.bookings.find(booking => 
      booking.status === 'Confirmed' || booking.status === 'Pending'
    );
  };

  return (
    <motion.div
      className="manage-students-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="header-section">
        <h2>Manage Students</h2>
        <div className="filters">
          <div className="search-bar">
            <FaSearch />
            <input
              type="text"
              placeholder="Search by name or registration number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="status-filter"
          >
            <option value="all">All Students</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="graduated">Graduated</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading students...</div>
      ) : (
        <div className="students-grid">
          {filteredStudents.map(student => {
            const currentBooking = getCurrentBooking(student);
            return (
              <motion.div
                key={student._id}
                className="student-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="student-header">
                  <FaUserGraduate className="student-icon" />
                  <div className="student-main-info">
                    <h3>{student.name}</h3>
                    <span className="reg-number">{student.regNumber}</span>
                  </div>
                  <span className={`status-badge ${student.status}`}>
                    {student.status}
                  </span>
                </div>

                <div className="student-details">
                  <div className="detail-row">
                    <span>Course:</span>
                    <span>{student.course}</span>
                  </div>
                  <div className="detail-row">
                    <span>Year:</span>
                    <span>{student.yearOfStudy}</span>
                  </div>
                  <div className="detail-row">
                    <span>Email:</span>
                    <span>{student.email}</span>
                  </div>
                  <div className="detail-row">
                    <span>Phone:</span>
                    <span>{student.phoneNumber}</span>
                  </div>
                  {currentBooking && (
                    <>
                      <div className="detail-row">
                        <span>Hostel:</span>
                        <span>{currentBooking.hostel.name}</span>
                      </div>
                      <div className="detail-row">
                        <span>Room:</span>
                        <span>{currentBooking.roomNumber}</span>
                      </div>
                      <div className="detail-row">
                        <span>Booking Status:</span>
                        <span className={`booking-status ${currentBooking.status.toLowerCase()}`}>
                          {currentBooking.status}
                        </span>
                      </div>
                    </>
                  )}
                </div>

                <div className="student-actions">
                  <button
                    className="email-btn"
                    onClick={() => {
                      setSelectedStudent(student);
                      setShowEmailModal(true);
                    }}
                  >
                    <FaEnvelope /> Email Student
                  </button>
                  {student.status === 'active' ? (
                    <button
                      className="suspend-btn"
                      onClick={() => handleStatusChange(student._id, 'suspended')}
                    >
                      <FaBan /> Suspend
                    </button>
                  ) : (
                    <button
                      className="activate-btn"
                      onClick={() => handleStatusChange(student._id, 'active')}
                    >
                      <FaCheck /> Activate
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Email Modal */}
      {showEmailModal && selectedStudent && (
        <div className="modal-overlay">
          <motion.div 
            className="modal-content"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <h3>Send Email to {selectedStudent.name}</h3>
            <form onSubmit={handleSendEmail}>
              <div className="form-group">
                <label>Subject</label>
                <input
                  type="text"
                  value={emailContent.subject}
                  onChange={(e) => setEmailContent({
                    ...emailContent,
                    subject: e.target.value
                  })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Message</label>
                <textarea
                  value={emailContent.message}
                  onChange={(e) => setEmailContent({
                    ...emailContent,
                    message: e.target.value
                  })}
                  required
                  rows={5}
                />
              </div>

              <div className="modal-actions">
                <button type="submit" className="submit-button">
                  Send Email
                </button>
                <button 
                  type="button" 
                  className="cancel-button"
                  onClick={() => {
                    setShowEmailModal(false);
                    setSelectedStudent(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default ManageStudents; 