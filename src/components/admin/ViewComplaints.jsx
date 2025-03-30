import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaExclamationCircle, FaReply, FaCheck, FaClock } from 'react-icons/fa';
import '../../css/ViewComplaints.css';

const ViewComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('http://localhost:5000/api/complaints', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch complaints');
      }

      const data = await response.json();
      setComplaints(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching complaints:', error);
      setLoading(false);
    }
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!selectedComplaint || !replyMessage.trim()) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`http://localhost:5000/api/complaints/${selectedComplaint._id}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: replyMessage,
          status: 'resolved' // Automatically mark as resolved when replying
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit reply');
      }

      const data = await response.json();
      setComplaints(complaints.map(complaint => 
        complaint._id === selectedComplaint._id ? data.complaint : complaint
      ));

      setShowReplyModal(false);
      setReplyMessage('');
      setSelectedComplaint(null);
    } catch (error) {
      console.error('Error submitting reply:', error);
    }
  };

  const handleStatusUpdate = async (complaintId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`http://localhost:5000/api/complaints/${complaintId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      const data = await response.json();
      setComplaints(complaints.map(complaint => 
        complaint._id === complaintId ? data.complaint : complaint
      ));
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'resolved': return <FaCheck className="status-icon resolved" />;
      case 'pending': return <FaClock className="status-icon pending" />;
      default: return null;
    }
  };

  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = 
      complaint.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || complaint.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <motion.div
      className="view-complaints-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="header-section">
        <h2>View Complaints</h2>
        <div className="filters">
          <div className="search-bar">
            <FaSearch />
            <input
              type="text"
              placeholder="Search complaints..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="status-filter"
          >
            <option value="all">All Complaints</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading complaints...</div>
      ) : (
        <div className="complaints-grid">
          {filteredComplaints.map(complaint => (
            <motion.div
              key={complaint._id}
              className="complaint-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="complaint-header">
                <div className="complaint-title">
                  <FaExclamationCircle className={`complaint-icon ${getPriorityColor(complaint.priority)}`} />
                  <div>
                    <h3>{complaint.title}</h3>
                    <span className="category">{complaint.category}</span>
                  </div>
                </div>
                <div className="status-indicator">
                  {getStatusIcon(complaint.status)}
                  <span className={`status-text ${complaint.status}`}>
                    {complaint.status}
                  </span>
                </div>
              </div>

              <div className="complaint-details">
                <div className="student-info">
                  <p><strong>{complaint.student.name}</strong> ({complaint.student.email})</p>
                </div>
                <p className="description">{complaint.description}</p>
                <div className="complaint-meta">
                  <span className="priority">
                    Priority: {complaint.priority}
                  </span>
                  <span className="date">
                    {new Date(complaint.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {complaint.replies && complaint.replies.length > 0 && (
                  <div className="replies-section">
                    <h4>Replies</h4>
                    {complaint.replies.map((reply, index) => (
                      <div key={index} className="reply-item">
                        <div className="reply-header">
                          <strong>{reply.admin.name}</strong>
                          <span>{new Date(reply.date).toLocaleDateString()}</span>
                        </div>
                        <p>{reply.message}</p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="complaint-actions">
                  {complaint.status !== 'resolved' && (
                    <>
                      <button
                        className="reply-button"
                        onClick={() => {
                          setSelectedComplaint(complaint);
                          setShowReplyModal(true);
                        }}
                      >
                        <FaReply /> Reply
                      </button>
                      <button
                        className="status-button"
                        onClick={() => handleStatusUpdate(complaint._id, 'in-progress')}
                      >
                        Mark In Progress
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Reply Modal */}
      {showReplyModal && selectedComplaint && (
        <div className="modal-overlay">
          <motion.div 
            className="modal-content"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <h3>Reply to Complaint</h3>
            <div className="complaint-summary">
              <p><strong>Title:</strong> {selectedComplaint.title}</p>
              <p><strong>Student:</strong> {selectedComplaint.student.name}</p>
            </div>
            <form onSubmit={handleReplySubmit}>
              <div className="form-group">
                <label>Your Response</label>
                <textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  required
                  rows={5}
                  placeholder="Type your response here..."
                />
              </div>

              <div className="modal-actions">
                <button type="submit" className="submit-button">
                  Send Reply
                </button>
                <button 
                  type="button" 
                  className="cancel-button"
                  onClick={() => {
                    setShowReplyModal(false);
                    setSelectedComplaint(null);
                    setReplyMessage('');
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

export default ViewComplaints; 