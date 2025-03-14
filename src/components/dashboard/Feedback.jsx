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
    // Simulate fetching feedback history
    const fetchFeedback = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setFeedbackHistory([
          {
            id: 1,
            date: '2024-01-15',
            rating: 4,
            cleanliness: 5,
            maintenance: 4,
            security: 5,
            facilities: 4,
            comment: "Great experience overall. The facilities are well-maintained.",
            response: "Thank you for your positive feedback!"
          },
          {
            id: 2,
            date: '2023-12-10',
            rating: 3,
            cleanliness: 3,
            maintenance: 4,
            security: 5,
            facilities: 3,
            comment: "Security is excellent but cleanliness could be improved.",
            response: null
          }
        ]);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching feedback:', error);
        setLoading(false);
      }
    };

    fetchFeedback();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Add your feedback submission logic here
    const feedback = {
      id: feedbackHistory.length + 1,
      date: new Date().toISOString().split('T')[0],
      ...newFeedback,
      response: null
    };
    setFeedbackHistory([feedback, ...feedbackHistory]);
    setNewFeedback({
      rating: 0,
      cleanliness: 0,
      maintenance: 0,
      security: 0,
      facilities: 0,
      comment: ''
    });
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
                key={feedback.id}
                className="feedback-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="feedback-header">
                  <div className="feedback-date">
                    {new Date(feedback.date).toLocaleDateString()}
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
                    <p>{feedback.response}</p>
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