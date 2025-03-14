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

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setFeedback([
        {
          id: 1,
          studentName: 'John Doe',
          regNumber: 'CS/001/2023',
          hostelBlock: 'Block A',
          rating: 4,
          category: 'Facilities',
          title: 'Great Amenities',
          comment: 'The hostel facilities are well-maintained. The study room is particularly helpful.',
          date: '2024-03-15',
          status: 'published',
          helpful: 15,
          notHelpful: 2,
          reported: false,
          response: null
        },
        // Add more mock data as needed
      ]);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching feedback:', error);
      setLoading(false);
    }
  };

  const handleStatusChange = async (feedbackId, newStatus) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setFeedback(feedback.map(item => 
        item.id === feedbackId 
          ? { ...item, status: newStatus }
          : item
      ));
    } catch (error) {
      console.error('Error updating feedback status:', error);
    }
  };

  const handleResponse = async (feedbackId, response) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setFeedback(feedback.map(item => 
        item.id === feedbackId 
          ? { ...item, response }
          : item
      ));
      setShowDetailsModal(false);
      setSelectedFeedback(null);
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
        case 'helpful':
          return b.helpful - a.helpful;
        case 'date':
        default:
          return new Date(b.date) - new Date(a.date);
      }
    });
  };

  const filteredFeedback = feedback
    .filter(item => {
      const matchesSearch = 
        item.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
            <option value="published">Published</option>
            <option value="hidden">Hidden</option>
            <option value="reported">Reported</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-filter"
          >
            <option value="date">Latest First</option>
            <option value="rating">Highest Rating</option>
            <option value="helpful">Most Helpful</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading feedback...</div>
      ) : (
        <div className="feedback-grid">
          {sortedFeedback.map(item => (
            <motion.div
              key={item.id}
              className="feedback-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="feedback-header">
                <div className="student-info">
                  <h3>{item.studentName}</h3>
                  <span className="reg-number">{item.regNumber}</span>
                </div>
                <div className="rating">
                  {renderStars(item.rating)}
                </div>
              </div>

              <div className="feedback-content">
                <div className="feedback-title">
                  <h4>{item.title}</h4>
                  <span className="category">{item.category}</span>
                </div>
                <p className="comment">{item.comment}</p>
                
                {item.response && (
                  <div className="admin-response">
                    <strong>Admin Response:</strong>
                    <p>{item.response}</p>
                  </div>
                )}

                <div className="feedback-stats">
                  <div className="helpful-stats">
                    <span>
                      <FaThumbsUp /> {item.helpful}
                    </span>
                    <span>
                      <FaThumbsDown /> {item.notHelpful}
                    </span>
                  </div>
                  {item.reported && (
                    <span className="reported">
                      <FaFlag /> Reported
                    </span>
                  )}
                </div>
              </div>

              <div className="feedback-footer">
                <span className="date">
                  {new Date(item.date).toLocaleDateString()}
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
                  {item.status === 'published' ? (
                    <button
                      className="hide-btn"
                      onClick={() => handleStatusChange(item.id, 'hidden')}
                    >
                      Hide
                    </button>
                  ) : (
                    <button
                      className="publish-btn"
                      onClick={() => handleStatusChange(item.id, 'published')}
                    >
                      Publish
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
              <p><strong>{selectedFeedback.title}</strong></p>
              <p>{selectedFeedback.comment}</p>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const response = e.target.response.value;
              handleResponse(selectedFeedback.id, response);
            }}>
              <div className="form-group">
                <label>Your Response</label>
                <textarea
                  name="response"
                  defaultValue={selectedFeedback.response || ''}
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