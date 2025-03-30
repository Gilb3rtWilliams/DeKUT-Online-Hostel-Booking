import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaStar, FaRegStar, FaQuoteLeft, FaPaperPlane, FaHistory } from 'react-icons/fa';
import '../../css/Feedback.css';

const Feedback = () => {
  const [feedbackHistory, setFeedbackHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newFeedback, setNewFeedback] = useState({
    rating: 0,
    cleanliness: 0,
    maintenance: 0,
    security: 0,
    facilities: 0,
    comment: ''
  });

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('http://localhost:5000/api/feedback/student', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch feedback');
      }

      const data = await response.json();
      setFeedbackHistory(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching feedback:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all required fields
    if (!newFeedback.rating || !newFeedback.cleanliness || !newFeedback.maintenance || 
        !newFeedback.security || !newFeedback.facilities || !newFeedback.comment.trim()) {
      alert('Please fill in all fields and provide ratings for all categories');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('http://localhost:5000/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newFeedback)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit feedback');
      }

      const data = await response.json();
      setFeedbackHistory([data.feedback, ...feedbackHistory]);
      setNewFeedback({
        rating: 0,
        cleanliness: 0,
        maintenance: 0,
        security: 0,
        facilities: 0,
        comment: ''
      });
      alert('Feedback submitted successfully!');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert(error.message || 'Failed to submit feedback. Please try again.');
    }
  };

  const RatingStars = ({ value, onChange, readOnly }) => {
    return (
      <div className="stars-container">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            onClick={() => !readOnly && onChange(star)}
            className={`star ${readOnly ? 'readonly' : ''}`}
          >
            {star <= value ? <FaStar /> : <FaRegStar />}
          </span>
        ))}
      </div>
    );
  };

  return (
    <motion.div
      className="feedback-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2>Hostel Feedback</h2>

      <div className="feedback-form-container">
        <h3>Submit New Feedback</h3>
        <form onSubmit={handleSubmit} className="feedback-form">
          <div className="rating-groups">
            <div className="rating-group">
              <label>Overall Rating</label>
              <RatingStars
                value={newFeedback.rating}
                onChange={(value) => setNewFeedback({...newFeedback, rating: value})}
              />
            </div>

            <div className="rating-group">
              <label>Cleanliness</label>
              <RatingStars
                value={newFeedback.cleanliness}
                onChange={(value) => setNewFeedback({...newFeedback, cleanliness: value})}
              />
            </div>

            <div className="rating-group">
              <label>Maintenance</label>
              <RatingStars
                value={newFeedback.maintenance}
                onChange={(value) => setNewFeedback({...newFeedback, maintenance: value})}
              />
            </div>

            <div className="rating-group">
              <label>Security</label>
              <RatingStars
                value={newFeedback.security}
                onChange={(value) => setNewFeedback({...newFeedback, security: value})}
              />
            </div>

            <div className="rating-group">
              <label>Facilities</label>
              <RatingStars
                value={newFeedback.facilities}
                onChange={(value) => setNewFeedback({...newFeedback, facilities: value})}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Additional Comments</label>
            <textarea
              value={newFeedback.comment}
              onChange={(e) => setNewFeedback({...newFeedback, comment: e.target.value})}
              placeholder="Share your experience and suggestions..."
              rows="4"
              required
            ></textarea>
          </div>

          <button type="submit" className="submit-button">
            <FaPaperPlane /> Submit Feedback
          </button>
        </form>
      </div>

      <div className="feedback-history">
        <h3><FaHistory /> Feedback History</h3>
        
        {loading ? (
          <div className="loading-message">Loading feedback history...</div>
        ) : (
          <div className="history-list">
            {feedbackHistory.map((feedback) => (
              <motion.div
                key={feedback._id}
                className="feedback-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="feedback-header">
                  <div className="feedback-date">
                    {new Date(feedback.createdAt).toLocaleDateString()}
                  </div>
                  <div className="overall-rating">
                    <RatingStars value={feedback.rating} readOnly={true} />
                  </div>
                </div>

                <div className="ratings-summary">
                  <div className="rating-item">
                    <span>Cleanliness</span>
                    <RatingStars value={feedback.cleanliness} readOnly={true} />
                  </div>
                  <div className="rating-item">
                    <span>Maintenance</span>
                    <RatingStars value={feedback.maintenance} readOnly={true} />
                  </div>
                  <div className="rating-item">
                    <span>Security</span>
                    <RatingStars value={feedback.security} readOnly={true} />
                  </div>
                  <div className="rating-item">
                    <span>Facilities</span>
                    <RatingStars value={feedback.facilities} readOnly={true} />
                  </div>
                </div>

                <div className="feedback-comment">
                  <FaQuoteLeft className="quote-icon" />
                  <p>{feedback.comment}</p>
                </div>

                {feedback.response && (
                  <div className="admin-response">
                    <h4>Admin Response:</h4>
                    <p>{feedback.response.message}</p>
                    <span className="response-date">
                      {new Date(feedback.response.date).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Feedback; 