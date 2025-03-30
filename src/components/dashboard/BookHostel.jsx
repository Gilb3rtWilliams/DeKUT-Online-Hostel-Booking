import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaBed, FaUsers, FaMoneyBillWave, FaCheckCircle, FaTimes } from 'react-icons/fa';
import '../../css/BookHostel.css';

const BookHostel = ({ setActiveTab }) => {
  const [selectedHostel, setSelectedHostel] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [bookingStep, setBookingStep] = useState(1);
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [formData, setFormData] = useState({
    hostelId: '',
    roomNumber: '',
    checkInDate: '',
    checkOutDate: ''
  });

  useEffect(() => {
    fetchHostels();
  }, []);

  const fetchHostels = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to view hostels');
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:5000/api/hostels', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch hostels');
      }

      const data = await response.json();
      setHostels(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching hostels:', error);
      setError('Failed to load hostels. Please try again later.');
      setLoading(false);
    }
  };

  const handleHostelSelect = (hostel) => {
    setSelectedHostel(hostel);
    setBookingStep(2);
  };

  const handleRoomSelect = (room) => {
    setSelectedRoom({
      number: room.number,
      price: selectedHostel.pricePerRoom
    });
    setBookingStep(3);
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to book a room');
        return;
      }

      // Validate required fields
      if (!selectedHostel || !selectedRoom) {
        setError('Please select a hostel and room');
        return;
      }

      // Set default dates if not provided
      const checkInDate = formData.checkInDate || new Date().toISOString().split('T')[0];
      const checkOutDate = formData.checkOutDate || new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString().split('T')[0];

      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          hostelId: selectedHostel._id,
          roomNumber: selectedRoom.number,
          price: selectedRoom.price,
          checkInDate: checkInDate,
          checkOutDate: checkOutDate,
          status: "Pending"
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to book room');
      }
      
      // Set the selected hostel and room before showing popup
      setSelectedHostel(hostels.find(h => h._id === selectedHostel._id));
      setSelectedRoom(selectedRoom);
      
      setShowSuccessPopup(true);
      setFormData({
        hostelId: '',
        roomNumber: '',
        checkInDate: '',
        checkOutDate: ''
      });
      
      // Refresh the hostels list
      fetchHostels();
      
      // Redirect to room details after 2 seconds
      setTimeout(() => {
        setActiveTab('roomDetails');
      }, 2000);
    } catch (error) {
      console.error('Booking error:', error);
      setError(error.message || 'Failed to book room. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading hostels...</p>
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
      className="book-hostel-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="booking-header">
        <h2>Book a Hostel</h2>
        <div className="booking-steps">
          <div className={`step ${bookingStep >= 1 ? 'active' : ''}`}>Select Hostel</div>
          <div className={`step ${bookingStep >= 2 ? 'active' : ''}`}>Choose Room</div>
          <div className={`step ${bookingStep >= 3 ? 'active' : ''}`}>Confirm</div>
          <div className={`step ${bookingStep >= 4 ? 'active' : ''}`}>Complete</div>
        </div>
      </div>

      {bookingStep === 1 && (
        <div className="hostels-grid">
          {hostels.map((hostel) => (
            <motion.div
              key={hostel._id}
              className="hostel-card"
              whileHover={{ scale: 1.02 }}
              onClick={() => handleHostelSelect(hostel)}
            >
              <h3>{hostel.name}</h3>
              <div className="hostel-info">
                <p><FaUsers /> {hostel.gender} Hostel</p>
                <p><FaBed /> {hostel.availableRooms} rooms available</p>
                <p><FaMoneyBillWave /> KES {hostel.pricePerRoom} per room</p>
                <p className="description">{hostel.description}</p>
              </div>
              <button className="select-button">Select Hostel</button>
            </motion.div>
          ))}
        </div>
      )}

      {bookingStep === 2 && selectedHostel && (
        <div className="rooms-section">
          <h3>Available Rooms in {selectedHostel.name}</h3>
          <div className="rooms-grid">
            {Array.from({ length: selectedHostel.availableRooms }, (_, index) => (
              <motion.div
                key={index}
                className="room-card"
                whileHover={{ scale: 1.02 }}
                onClick={() => handleRoomSelect({
                  number: `${selectedHostel.name[0]}${index + 1}`,
                  price: selectedHostel.pricePerRoom
                })}
              >
                <h4>Room {`${selectedHostel.name[0]}${index + 1}`}</h4>
                <div className="room-info">
                  <p><FaMoneyBillWave /> KES {selectedHostel.pricePerRoom}</p>
                </div>
                <button className="select-button">Select Room</button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {bookingStep === 3 && selectedRoom && (
        <div className="booking-confirmation">
          <h3>Confirm Your Booking</h3>
          <div className="confirmation-details">
            <div className="detail-item">
              <strong>Hostel:</strong> {selectedHostel.name}
            </div>
            <div className="detail-item">
              <strong>Room:</strong> {selectedRoom.number}
            </div>
            <div className="detail-item">
              <strong>Price:</strong> KES {selectedRoom.price}
            </div>
          </div>
          <div className="button-group">
            <button className="confirm-button" onClick={handleBooking}>
              Confirm Booking
            </button>
            <button 
              className="back-button"
              onClick={() => setBookingStep(2)}
            >
              Go Back
            </button>
          </div>
        </div>
      )}

      {showSuccessPopup && (
        <div className="success-popup-overlay">
          <motion.div 
            className="success-popup"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <button 
              className="close-popup"
              onClick={() => setShowSuccessPopup(false)}
            >
              <FaTimes />
            </button>
            <FaCheckCircle className="success-icon" />
            <h3>Booking Successful!</h3>
            <p>Your room has been successfully booked.</p>
            <div className="success-details">
              <p><strong>Hostel:</strong> {selectedHostel.name}</p>
              <p><strong>Room:</strong> {selectedRoom.number}</p>
              <p><strong>Amount Paid:</strong> KES {selectedRoom.price}</p>
            </div>
            <button 
              className="close-button"
              onClick={() => setShowSuccessPopup(false)}
            >
              Close
            </button>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default BookHostel;
