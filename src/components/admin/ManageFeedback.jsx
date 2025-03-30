import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaStar, FaComment, FaThumbsUp, FaThumbsDown, FaFlag } from 'react-icons/fa';
import '../../css/ManageFeedback.css';

const ManageFeedback = () => {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [responseMessage, setResponseMessage] = useState('');

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('http://localhost:5000/api/feedback', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch feedback');
      }

      const data = await response.json();
      setFeedback(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching feedback:', error);
      setLoading(false);
    }
  };

  const handleStatusChange = async (feedbackId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`http://localhost:5000/api/feedback/${feedbackId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error('Failed to update feedback status');
      }

      const data = await response.json();
      setFeedback(feedback.map(item => 
        item._id === feedbackId ? data.feedback : item
      ));
    } catch (error) {
      console.error('Error updating feedback status:', error);
    }
  };

  const handleResponse = async (e) => {
    e.preventDefault();
    if (!selectedFeedback || !responseMessage.trim()) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`http://localhost:5000/api/feedback/${selectedFeedback._id}/response`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: responseMessage })
      });

      if (!response.ok) {
        throw new Error('Failed to submit response');
      }

      const data = await response.json();
      setFeedback(feedback.map(item => 
        item._id === selectedFeedback._id ? data.feedback : item
      ));
      setShowDetailsModal(false);
      setSelectedFeedback(null);
      setResponseMessage('');
    } catch (error) {
      console.error('Error submitting response:', error);
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <FaStar
        key={index}
        className={index < rating ? 'star filled' : 'star empty'}
      />
    ));
  };

  const sortFeedback = (feedbackList) => {
    return [...feedbackList].sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'date':
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });
  };

  const filteredFeedback = feedback
    .filter(item => {
      const matchesSearch = 
        item.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.comment.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filter === 'all' || item.status === filter;
      return matchesSearch && matchesFilter;
    });

  const sortedFeedback = sortFeedback(filteredFeedback);

  return (
    <motion.div
      className="manage-feedback-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="header-section">
        <h2>Manage Feedback</h2>
        <div className="filters">
          <div className="search-bar">
            <FaSearch />
            <input
              type="text"
              placeholder="Search feedback..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="status-filter"
          >
            <option value="all">All Feedback</option>
            <option value="pending">Pending</option>
            <option value="published">Published</option>
            <option value="hidden">Hidden</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-filter"
          >
            <option value="date">Latest First</option>
            <option value="rating">Highest Rating</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading feedback...</div>
      ) : (
        <div className="feedback-grid">
          {sortedFeedback.map(item => (
            <motion.div
              key={item._id}
              className="feedback-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="feedback-header">
                <div className="student-info">
                  <h3>{item.student.name}</h3>
                  <span className="student-email">{item.student.email}</span>
                </div>
                <div className="rating">
                  {renderStars(item.rating)}
                </div>
              </div>

              <div className="feedback-content">
                <div className="ratings-summary">
                  <div className="rating-item">
                    <span>Cleanliness</span>
                    {renderStars(item.cleanliness)}
                  </div>
                  <div className="rating-item">
                    <span>Maintenance</span>
                    {renderStars(item.maintenance)}
                  </div>
                  <div className="rating-item">
                    <span>Security</span>
                    {renderStars(item.security)}
                  </div>
                  <div className="rating-item">
                    <span>Facilities</span>
                    {renderStars(item.facilities)}
                  </div>
                </div>

                <p className="comment">{item.comment}</p>
                
                {item.response && (
                  <div className="admin-response">
                    <strong>Admin Response:</strong>
                    <p>{item.response.message}</p>
                    <span className="response-date">
                      {new Date(item.response.date).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>

              <div className="feedback-footer">
                <span className="date">
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
                <div className="actions">
                  <button
                    className="respond-btn"
                    onClick={() => {
                      setSelectedFeedback(item);
                      setShowDetailsModal(true);
                    }}
                  >
                    <FaComment /> Respond
                  </button>
                  {item.status === 'pending' && (
                    <button
                      className="publish-btn"
                      onClick={() => handleStatusChange(item._id, 'published')}
                    >
                      Publish
                    </button>
                  )}
                  {item.status === 'published' && (
                    <button
                      className="hide-btn"
                      onClick={() => handleStatusChange(item._id, 'hidden')}
                    >
                      Hide
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Response Modal */}
      {showDetailsModal && selectedFeedback && (
        <div className="modal-overlay">
          <motion.div 
            className="modal-content"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <h3>Respond to Feedback</h3>
            <div className="feedback-summary">
              <div className="rating">
                {renderStars(selectedFeedback.rating)}
              </div>
              <p>{selectedFeedback.comment}</p>
            </div>
            <form onSubmit={handleResponse}>
              <div className="form-group">
                <label>Your Response</label>
                <textarea
                  value={responseMessage}
                  onChange={(e) => setResponseMessage(e.target.value)}
                  required
                  rows={5}
                  placeholder="Type your response here..."
                />
              </div>

              <div className="modal-actions">
                <button type="submit" className="submit-button">
                  Submit Response
                </button>
                <button 
                  type="button" 
                  className="cancel-button"
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedFeedback(null);
                    setResponseMessage('');
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

export default ManageFeedback; 