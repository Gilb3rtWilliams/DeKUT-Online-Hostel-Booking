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
    // Simulate fetching complaints
    const fetchComplaints = async () => {
      try {
        // Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setComplaints([
          {
            id: 1,
            title: "Faulty Light Fixture",
            description: "The ceiling light in my room is not working properly.",
            category: "Electrical",
            priority: "high",
            status: "pending",
            date: "2024-01-15",
            response: null
          },
          {
            id: 2,
            title: "Water Pressure Issue",
            description: "Low water pressure in the bathroom.",
            category: "Plumbing",
            priority: "medium",
            status: "resolved",
            date: "2024-01-10",
            response: "Maintenance team has fixed the water pressure regulator."
          }
        ]);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching complaints:', error);
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Add your complaint submission logic here
    const complaint = {
      id: complaints.length + 1,
      ...newComplaint,
      status: 'pending',
      date: new Date().toISOString().split('T')[0],
      response: null
    };
    setComplaints([complaint, ...complaints]);
    setShowForm(false);
    setNewComplaint({
      title: '',
      description: '',
      category: '',
      priority: 'medium'
    });
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
                key={complaint.id}
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
                      <FaClock /> {new Date(complaint.date).toLocaleDateString()}
                    </span>
                    <span className={`priority priority-${complaint.priority}`}>
                      Priority: {complaint.priority}
                    </span>
                  </div>

                  {complaint.response && (
                    <div className="complaint-response">
                      <h4>Response:</h4>
                      <p>{complaint.response}</p>
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