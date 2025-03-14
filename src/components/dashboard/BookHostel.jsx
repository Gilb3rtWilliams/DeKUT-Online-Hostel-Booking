import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaBed, FaUsers, FaMoneyBillWave, FaCheckCircle } from 'react-icons/fa';
import '../../css/BookHostel.css';

const BookHostel = () => {
  const [selectedHostel, setSelectedHostel] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [bookingStep, setBookingStep] = useState(1);

  // Sample data - replace with actual API data
  const hostels = [
    { id: 1, name: "Block A", gender: "Male", totalRooms: 100, availableRooms: 25 },
    { id: 2, name: "Block B", gender: "Female", totalRooms: 100, availableRooms: 30 },
    { id: 3, name: "Block C", gender: "Male", totalRooms: 80, availableRooms: 15 },
    { id: 4, name: "Block D", gender: "Female", totalRooms: 80, availableRooms: 20 },
  ];

  const rooms = [
    { id: 1, number: "A101", type: "Single", price: 15000, available: true },
    { id: 2, number: "A102", type: "Sharing", price: 12000, available: true },
    { id: 3, number: "A103", type: "Single", price: 15000, available: true },
    { id: 4, number: "A104", type: "Sharing", price: 12000, available: true },
  ];

  const handleHostelSelect = (hostel) => {
    setSelectedHostel(hostel);
    setBookingStep(2);
  };

  const handleRoomSelect = (room) => {
    setSelectedRoom(room);
    setBookingStep(3);
  };

  const handleBooking = async () => {
    // Add your booking logic here
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setBookingStep(4);
    } catch (error) {
      console.error('Booking failed:', error);
    }
  };

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
              key={hostel.id}
              className="hostel-card"
              whileHover={{ scale: 1.02 }}
              onClick={() => handleHostelSelect(hostel)}
            >
              <h3>{hostel.name}</h3>
              <div className="hostel-info">
                <p><FaUsers /> {hostel.gender} Hostel</p>
                <p><FaBed /> {hostel.availableRooms} rooms available</p>
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
            {rooms.map((room) => (
              <motion.div
                key={room.id}
                className="room-card"
                whileHover={{ scale: 1.02 }}
                onClick={() => handleRoomSelect(room)}
              >
                <h4>Room {room.number}</h4>
                <div className="room-info">
                  <p><FaBed /> {room.type}</p>
                  <p><FaMoneyBillWave /> KES {room.price}</p>
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
              <strong>Type:</strong> {selectedRoom.type}
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

      {bookingStep === 4 && (
        <div className="booking-success">
          <FaCheckCircle className="success-icon" />
          <h3>Booking Successful!</h3>
          <p>Your room has been successfully booked. You will receive a confirmation email shortly.</p>
          <div className="success-details">
            <p><strong>Hostel:</strong> {selectedHostel.name}</p>
            <p><strong>Room:</strong> {selectedRoom.number}</p>
            <p><strong>Amount Paid:</strong> KES {selectedRoom.price}</p>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default BookHostel;
