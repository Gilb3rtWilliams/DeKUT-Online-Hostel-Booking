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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setComplaints([
        {
          id: 1,
          studentName: 'John Doe',
          regNumber: 'CS/001/2023',
          hostelBlock: 'Block A',
          roomNumber: 'A101',
          category: 'Maintenance',
          subject: 'Water Supply Issue',
          description: 'No water supply in the bathroom for the last 2 days.',
          date: '2024-03-15',
          status: 'pending',
          priority: 'high',
          attachments: ['plumbing.jpg'],
          replies: []
        },
        // Add more mock data as needed
      ]);
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const reply = {
        id: Date.now(),
        message: replyMessage,
        date: new Date().toISOString(),
        adminName: 'Admin' // Replace with actual admin name
      };

      setComplaints(complaints.map(complaint => 
        complaint.id === selectedComplaint.id
          ? {
              ...complaint,
              status: 'resolved',
              replies: [...complaint.replies, reply]
            }
          : complaint
      ));

      setShowReplyModal(false);
      setReplyMessage('');
      setSelectedComplaint(null);
    } catch (error) {
      console.error('Error submitting reply:', error);
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
      complaint.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
              key={complaint.id}
              className="complaint-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="complaint-header">
                <div className="complaint-title">
                  <FaExclamationCircle className={`complaint-icon ${getPriorityColor(complaint.priority)}`} />
                  <div>
                    <h3>{complaint.subject}</h3>
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
                  <p><strong>{complaint.studentName}</strong> ({complaint.regNumber})</p>
                  <p>
                    {complaint.hostelBlock} - Room {complaint.roomNumber}
                  </p>
                </div>
                <p className="description">{complaint.description}</p>
                {complaint.attachments && complaint.attachments.length > 0 && (
                  <div className="attachments">
                    <p className="attachment-label">Attachments:</p>
                    <div className="attachment-list">
                      {complaint.attachments.map((file, index) => (
                        <span key={index} className="attachment-item">
                          {file}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="complaint-footer">
                  <span className="date">
                    {new Date(complaint.date).toLocaleDateString()}
                  </span>
                  {complaint.status === 'pending' && (
                    <button
                      className="reply-button"
                      onClick={() => {
                        setSelectedComplaint(complaint);
                        setShowReplyModal(true);
                      }}
                    >
                      <FaReply /> Reply
                    </button>
                  )}
                </div>

                {complaint.replies.length > 0 && (
                  <div className="replies-section">
                    <h4>Replies</h4>
                    {complaint.replies.map(reply => (
                      <div key={reply.id} className="reply-item">
                        <div className="reply-header">
                          <strong>{reply.adminName}</strong>
                          <span>{new Date(reply.date).toLocaleDateString()}</span>
                        </div>
                        <p>{reply.message}</p>
                      </div>
                    ))}
                  </div>
                )}
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
              <p><strong>Subject:</strong> {selectedComplaint.subject}</p>
              <p><strong>Student:</strong> {selectedComplaint.studentName}</p>
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