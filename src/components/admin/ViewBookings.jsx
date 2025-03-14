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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setBookings([
        {
          id: 1,
          studentName: 'John Doe',
          regNumber: 'CS/001/2023',
          hostelBlock: 'Block A',
          roomNumber: 'A101',
          roomType: 'Single',
          bookingDate: '2024-03-15',
          status: 'pending',
          duration: '1 semester',
          amount: 15000,
          paymentStatus: 'paid',
          specialRequests: 'Ground floor preferred',
          contactNumber: '+254712345678',
          email: 'john.doe@university.edu'
        },
        // Add more mock data as needed
      ]);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setLoading(false);
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setBookings(bookings.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: newStatus }
          : booking
      ));
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'success';
      case 'rejected': return 'danger';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.regNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.roomNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || booking.status === filter;
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
              placeholder="Search by name, reg number or room..."
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
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading bookings...</div>
      ) : (
        <div className="bookings-grid">
          {filteredBookings.map(booking => (
            <motion.div
              key={booking.id}
              className="booking-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="booking-header">
                <div className="booking-title">
                  <FaCalendarAlt className="booking-icon" />
                  <div>
                    <h3>{booking.studentName}</h3>
                    <span className="reg-number">{booking.regNumber}</span>
                  </div>
                </div>
                <span className={`status-badge ${getStatusColor(booking.status)}`}>
                  {booking.status}
                </span>
              </div>

              <div className="booking-details">
                <div className="detail-row">
                  <span>Hostel:</span>
                  <span>{booking.hostelBlock}</span>
                </div>
                <div className="detail-row">
                  <span>Room:</span>
                  <span>{booking.roomNumber}</span>
                </div>
                <div className="detail-row">
                  <span>Type:</span>
                  <span>{booking.roomType}</span>
                </div>
                <div className="detail-row">
                  <span>Date:</span>
                  <span>{new Date(booking.bookingDate).toLocaleDateString()}</span>
                </div>
                <div className="detail-row">
                  <span>Payment:</span>
                  <span className={`payment-status ${booking.paymentStatus}`}>
                    {booking.paymentStatus}
                  </span>
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
                {booking.status === 'pending' && (
                  <>
                    <button
                      className="approve-btn"
                      onClick={() => handleStatusChange(booking.id, 'approved')}
                    >
                      <FaCheck /> Approve
                    </button>
                    <button
                      className="reject-btn"
                      onClick={() => handleStatusChange(booking.id, 'rejected')}
                    >
                      <FaTimes /> Reject
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          ))}
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
                  <span>{selectedBooking.studentName}</span>
                </div>
                <div className="detail-item">
                  <span>Registration Number:</span>
                  <span>{selectedBooking.regNumber}</span>
                </div>
                <div className="detail-item">
                  <span>Contact:</span>
                  <span>{selectedBooking.contactNumber}</span>
                </div>
                <div className="detail-item">
                  <span>Email:</span>
                  <span>{selectedBooking.email}</span>
                </div>
              </div>

              <div className="detail-group">
                <h4>Booking Information</h4>
                <div className="detail-item">
                  <span>Hostel Block:</span>
                  <span>{selectedBooking.hostelBlock}</span>
                </div>
                <div className="detail-item">
                  <span>Room Number:</span>
                  <span>{selectedBooking.roomNumber}</span>
                </div>
                <div className="detail-item">
                  <span>Room Type:</span>
                  <span>{selectedBooking.roomType}</span>
                </div>
                <div className="detail-item">
                  <span>Duration:</span>
                  <span>{selectedBooking.duration}</span>
                </div>
                <div className="detail-item">
                  <span>Amount:</span>
                  <span>KES {selectedBooking.amount}</span>
                </div>
                <div className="detail-item">
                  <span>Special Requests:</span>
                  <span>{selectedBooking.specialRequests || 'None'}</span>
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