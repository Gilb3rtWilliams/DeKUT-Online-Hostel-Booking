import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaBed, FaCalendar, FaMoneyBillWave, FaKey, FaMapMarkerAlt, FaUsers } from 'react-icons/fa';
import '../../css/RoomDetails.css';

const RoomDetails = ({ setActiveTab }) => {
  const [currentBooking, setCurrentBooking] = useState(null);
  const [bookingHistory, setBookingHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('RoomDetails component mounted');
    fetchBookingDetails();
  }, []);

  const fetchBookingDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Token:', token ? 'Present' : 'Missing');
      
      if (!token) {
        setError('Please log in to view booking details');
        setLoading(false);
        return;
      }

      console.log('Fetching booking details...');
      const response = await fetch('http://localhost:5000/api/bookings/student', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error('Failed to fetch booking details');
      }

      const data = await response.json();
      console.log('Received data:', data);
      
      // Find the current active or approved booking
      const activeBooking = data.find(booking => 
        booking.status === 'Active' || booking.status === 'Approved'
      );
      console.log('Active booking:', activeBooking);
      setCurrentBooking(activeBooking || null);
      
      // Set booking history (all bookings except the current one)
      const history = data.filter(booking => 
        booking.status !== 'Active' && booking.status !== 'Approved'
      );
      console.log('Booking history:', history);
      setBookingHistory(history);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching booking details:', error);
      setError('Failed to fetch booking details');
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'approved': return 'success';
      case 'rejected': return 'danger';
      case 'pending': return 'warning';
      case 'active': return 'info';
      case 'cancelled': return 'danger';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading booking details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
      </div>
    );
  }

  return (
    <motion.div
      className="room-details-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2>Room Details</h2>

      {currentBooking ? (
        <div className="current-booking">
          <h3>Current Room</h3>
          <div className="room-info-grid">
            <div className="info-card">
              <FaMapMarkerAlt className="info-icon" />
              <div className="info-content">
                <label>Hostel</label>
                <span>{currentBooking.hostel.name}</span>
              </div>
            </div>

            <div className="info-card">
              <FaKey className="info-icon" />
              <div className="info-content">
                <label>Room Number</label>
                <span>{currentBooking.roomNumber}</span>
              </div>
            </div>

            <div className="info-card">
              <FaUsers className="info-icon" />
              <div className="info-content">
                <label>Gender</label>
                <span>{currentBooking.hostel.gender}</span>
              </div>
            </div>

            <div className="info-card">
              <FaMoneyBillWave className="info-icon" />
              <div className="info-content">
                <label>Amount Paid</label>
                <span>KES {currentBooking.price}</span>
              </div>
            </div>
          </div>

          <div className="booking-dates">
            <div className="date-group">
              <FaCalendar className="date-icon" />
              <div>
                <label>Check-in Date</label>
                <span>{new Date(currentBooking.checkInDate).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="date-group">
              <FaCalendar className="date-icon" />
              <div>
                <label>Check-out Date</label>
                <span>{new Date(currentBooking.checkOutDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="status-badge active">
            {currentBooking.status}
          </div>
        </div>
      ) : (
        <div className="no-booking">
          <FaBed className="no-booking-icon" />
          <p>No active room booking found.</p>
          <button 
            className="book-now-button"
            onClick={() => setActiveTab('bookHostel')}
          >
            Book Now
          </button>
        </div>
      )}

      <div className="booking-history">
        <h3>Booking History</h3>
        {bookingHistory.length > 0 ? (
          <div className="history-table">
            <table>
              <thead>
                <tr>
                  <th>Hostel</th>
                  <th>Room</th>
                  <th>Check-in</th>
                  <th>Check-out</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookingHistory.map((booking) => (
                  <tr key={booking._id}>
                    <td>{booking.hostel.name}</td>
                    <td>{booking.roomNumber}</td>
                    <td>{new Date(booking.checkInDate).toLocaleDateString()}</td>
                    <td>{new Date(booking.checkOutDate).toLocaleDateString()}</td>
                    <td>KES {booking.price}</td>
                    <td>
                      <span className={`status-badge ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="no-history">No booking history found.</p>
        )}
      </div>
    </motion.div>
  );
};

export default RoomDetails; 