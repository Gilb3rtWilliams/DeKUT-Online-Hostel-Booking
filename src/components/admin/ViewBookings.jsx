import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaCheck, FaTimes, FaInfoCircle, FaCalendarAlt } from 'react-icons/fa';
import '../../css/ViewBookings.css';

const ViewBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('http://localhost:5000/api/bookings', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }

      const data = await response.json();
      console.log('Fetched bookings:', data);
      setBookings(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setLoading(false);
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update booking status');
      }

      // Show success message
      alert(`Booking ${newStatus.toLowerCase()} successfully`);
      
      // Refresh the bookings list
      fetchBookings();
    } catch (error) {
      console.error('Error updating booking status:', error);
      alert(error.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'approved': return 'success';
      case 'rejected': return 'danger';
      case 'pending': return 'warning';
      case 'active': return 'info';
      default: return 'default';
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.hostel.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || booking.status.toLowerCase() === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <motion.div
      className="view-bookings-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="header-section">
        <h2>View Bookings</h2>
        <div className="filters">
          <div className="search-bar">
            <FaSearch />
            <input
              type="text"
              placeholder="Search by name, room or hostel..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="status-filter"
          >
            <option value="all">All Bookings</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="active">Active</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading bookings...</div>
      ) : (
        <div className="bookings-grid">
          {filteredBookings.map(booking => {
            console.log('Booking status:', booking.status);
            return (
              <motion.div
                key={booking._id}
                className="booking-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="booking-header">
                  <div className="booking-title">
                    <FaCalendarAlt className="booking-icon" />
                    <div>
                      <h3>{booking.student.name}</h3>
                      <span className="reg-number">{booking.student.email}</span>
                    </div>
                  </div>
                  <span className={`status-badge ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                </div>

                <div className="booking-details">
                  <div className="detail-row">
                    <span>Hostel:</span>
                    <span>{booking.hostel.name}</span>
                  </div>
                  <div className="detail-row">
                    <span>Room:</span>
                    <span>{booking.roomNumber}</span>
                  </div>
                  <div className="detail-row">
                    <span>Price:</span>
                    <span>KES {booking.price}</span>
                  </div>
                  <div className="detail-row">
                    <span>Check-in:</span>
                    <span>{new Date(booking.checkInDate).toLocaleDateString()}</span>
                  </div>
                  <div className="detail-row">
                    <span>Check-out:</span>
                    <span>{new Date(booking.checkOutDate).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="booking-actions">
                  <button
                    className="details-btn"
                    onClick={() => {
                      setSelectedBooking(booking);
                      setShowDetailsModal(true);
                    }}
                  >
                    <FaInfoCircle /> View Details
                  </button>
                  {booking.status === 'Pending' && (
                    <>
                      <button
                        className="approve-btn"
                        onClick={() => handleStatusChange(booking._id, 'Approved')}
                      >
                        <FaCheck /> Approve
                      </button>
                      <button
                        className="reject-btn"
                        onClick={() => handleStatusChange(booking._id, 'Rejected')}
                      >
                        <FaTimes /> Reject
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedBooking && (
        <div className="modal-overlay">
          <motion.div 
            className="modal-content"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <h3>Booking Details</h3>
            <div className="modal-body">
              <div className="detail-group">
                <h4>Student Information</h4>
                <div className="detail-item">
                  <span>Name:</span>
                  <span>{selectedBooking.student.name}</span>
                </div>
                <div className="detail-item">
                  <span>Email:</span>
                  <span>{selectedBooking.student.email}</span>
                </div>
              </div>

              <div className="detail-group">
                <h4>Booking Information</h4>
                <div className="detail-item">
                  <span>Hostel:</span>
                  <span>{selectedBooking.hostel.name}</span>
                </div>
                <div className="detail-item">
                  <span>Room Number:</span>
                  <span>{selectedBooking.roomNumber}</span>
                </div>
                <div className="detail-item">
                  <span>Price:</span>
                  <span>KES {selectedBooking.price}</span>
                </div>
                <div className="detail-item">
                  <span>Check-in Date:</span>
                  <span>{new Date(selectedBooking.checkInDate).toLocaleDateString()}</span>
                </div>
                <div className="detail-item">
                  <span>Check-out Date:</span>
                  <span>{new Date(selectedBooking.checkOutDate).toLocaleDateString()}</span>
                </div>
                <div className="detail-item">
                  <span>Status:</span>
                  <span className={`status-badge ${getStatusColor(selectedBooking.status)}`}>
                    {selectedBooking.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button 
                className="close-button"
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedBooking(null);
                }}
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default ViewBookings; 