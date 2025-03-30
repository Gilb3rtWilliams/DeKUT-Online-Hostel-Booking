import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaExclamationCircle, FaClock, FaCheck, FaTimes, FaPlus } from 'react-icons/fa';
import '../../css/Complaints.css';

const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newComplaint, setNewComplaint] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'medium'
  });

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('http://localhost:5000/api/complaints/student', {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('http://localhost:5000/api/complaints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newComplaint)
      });

      if (!response.ok) {
        throw new Error('Failed to submit complaint');
      }

      const data = await response.json();
      setComplaints([data.complaint, ...complaints]);
      setShowForm(false);
      setNewComplaint({
        title: '',
        description: '',
        category: '',
        priority: 'medium'
      });
    } catch (error) {
      console.error('Error submitting complaint:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'in-progress': return 'status-progress';
      case 'resolved': return 'status-resolved';
      default: return '';
    }
  };

  return (
    <motion.div
      className="complaints-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="complaints-header">
        <h2>Complaints</h2>
        <button 
          className="new-complaint-button"
          onClick={() => setShowForm(true)}
        >
          <FaPlus /> New Complaint
        </button>
      </div>

      {showForm && (
        <motion.div 
          className="complaint-form-container"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <form onSubmit={handleSubmit} className="complaint-form">
            <h3>Submit New Complaint</h3>
            
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                value={newComplaint.title}
                onChange={(e) => setNewComplaint({...newComplaint, title: e.target.value})}
                placeholder="Brief title of the issue"
                required
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <select
                value={newComplaint.category}
                onChange={(e) => setNewComplaint({...newComplaint, category: e.target.value})}
                required
              >
                <option value="">Select Category</option>
                <option value="Electrical">Electrical</option>
                <option value="Plumbing">Plumbing</option>
                <option value="Furniture">Furniture</option>
                <option value="Cleanliness">Cleanliness</option>
                <option value="Security">Security</option>
                <option value="Others">Others</option>
              </select>
            </div>

            <div className="form-group">
              <label>Priority</label>
              <select
                value={newComplaint.priority}
                onChange={(e) => setNewComplaint({...newComplaint, priority: e.target.value})}
                required
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                value={newComplaint.description}
                onChange={(e) => setNewComplaint({...newComplaint, description: e.target.value})}
                placeholder="Detailed description of the issue"
                rows="4"
                required
              ></textarea>
            </div>

            <div className="form-buttons">
              <button type="submit" className="submit-button">Submit</button>
              <button 
                type="button" 
                className="cancel-button"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {loading ? (
        <div className="loading-message">Loading complaints...</div>
      ) : (
        <div className="complaints-list">
          {complaints.length > 0 ? (
            complaints.map((complaint) => (
              <motion.div
                key={complaint._id}
                className="complaint-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="complaint-header">
                  <h3>{complaint.title}</h3>
                  <span className={`status-badge ${getStatusColor(complaint.status)}`}>
                    {complaint.status}
                  </span>
                </div>

                <div className="complaint-details">
                  <p className="description">{complaint.description}</p>
                  
                  <div className="complaint-meta">
                    <span className="category">
                      <FaExclamationCircle /> {complaint.category}
                    </span>
                    <span className="date">
                      <FaClock /> {new Date(complaint.createdAt).toLocaleDateString()}
                    </span>
                    <span className={`priority priority-${complaint.priority}`}>
                      Priority: {complaint.priority}
                    </span>
                  </div>

                  {complaint.replies && complaint.replies.length > 0 && (
                    <div className="complaint-response">
                      <h4>Responses:</h4>
                      {complaint.replies.map((reply, index) => (
                        <div key={index} className="reply-item">
                          <p className="reply-message">{reply.message}</p>
                          <span className="reply-date">
                            {new Date(reply.date).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          ) : (
            <div className="no-complaints">
              <FaExclamationCircle />
              <p>No complaints filed yet.</p>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default Complaints; 