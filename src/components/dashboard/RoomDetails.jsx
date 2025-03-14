import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaBed, FaCalendar, FaMoneyBillWave, FaKey, FaMapMarkerAlt, FaUsers } from 'react-icons/fa';
import '../../css/RoomDetails.css';

const RoomDetails = () => {
  const [currentBooking, setCurrentBooking] = useState(null);
  const [bookingHistory, setBookingHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch room details
    const fetchRoomDetails = async () => {
      try {
        // Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Sample data
        setCurrentBooking({
          hostelName: "Block A",
          roomNumber: "A204",
          roomType: "Single",
          checkInDate: "2024-01-15",
          checkOutDate: "2024-04-15",
          amount: 15000,
          status: "Active"
        });

        setBookingHistory([
          {
            id: 1,
            hostelName: "Block B",
            roomNumber: "B156",
            checkInDate: "2023-09-01",
            checkOutDate: "2023-12-15",
            amount: 12000,
            status: "Completed"
          },
          {
            id: 2,
            hostelName: "Block A",
            roomNumber: "A145",
            checkInDate: "2023-05-01",
            checkOutDate: "2023-08-15",
            amount: 15000,
            status: "Completed"
          }
        ]);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching room details:', error);
        setLoading(false);
      }
    };

    fetchRoomDetails();
  }, []);

  return (
    <motion.div
      className="room-details-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2>Room Details</h2>

      {loading ? (
        <div className="loading-message">Loading room details...</div>
      ) : (
        <>
          {currentBooking ? (
            <div className="current-booking">
              <h3>Current Room</h3>
              <div className="room-info-grid">
                <div className="info-card">
                  <FaMapMarkerAlt className="info-icon" />
                  <div className="info-content">
                    <label>Hostel</label>
                    <span>{currentBooking.hostelName}</span>
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
                  <FaBed className="info-icon" />
                  <div className="info-content">
                    <label>Room Type</label>
                    <span>{currentBooking.roomType}</span>
                  </div>
                </div>

                <div className="info-card">
                  <FaMoneyBillWave className="info-icon" />
                  <div className="info-content">
                    <label>Amount Paid</label>
                    <span>KES {currentBooking.amount}</span>
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
              <button className="book-now-button">Book Now</button>
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
                      <tr key={booking.id}>
                        <td>{booking.hostelName}</td>
                        <td>{booking.roomNumber}</td>
                        <td>{new Date(booking.checkInDate).toLocaleDateString()}</td>
                        <td>{new Date(booking.checkOutDate).toLocaleDateString()}</td>
                        <td>KES {booking.amount}</td>
                        <td>
                          <span className={`status-badge ${booking.status.toLowerCase()}`}>
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
        </>
      )}
    </motion.div>
  );
};

export default RoomDetails; 