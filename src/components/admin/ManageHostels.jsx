import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaBuilding, FaBed, FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import '../../css/ManageHostels.css';

const ManageHostels = () => {
  const [hostels, setHostels] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showRoomForm, setShowRoomForm] = useState(false);
  const [selectedHostel, setSelectedHostel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [newHostel, setNewHostel] = useState({
    name: '',
    gender: 'male',
    totalRooms: '',
    description: ''
  });

  const [newRoom, setNewRoom] = useState({
    roomNumber: '',
    type: 'single',
    price: '',
    status: 'available'
  });

  useEffect(() => {
    // Simulate fetching hostels data
    fetchHostels();
  }, []);

  const fetchHostels = async () => {
    try {
      // Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setHostels([
        {
          id: 1,
          name: 'Block A',
          gender: 'male',
          totalRooms: 100,
          occupiedRooms: 75,
          description: 'Male hostel block with modern facilities',
          rooms: [
            { id: 1, roomNumber: 'A101', type: 'single', price: 15000, status: 'occupied' },
            { id: 2, roomNumber: 'A102', type: 'sharing', price: 12000, status: 'available' },
          ]
        },
        {
          id: 2,
          name: 'Block B',
          gender: 'female',
          totalRooms: 100,
          occupiedRooms: 80,
          description: 'Female hostel block with enhanced security',
          rooms: [
            { id: 3, roomNumber: 'B101', type: 'single', price: 15000, status: 'available' },
            { id: 4, roomNumber: 'B102', type: 'sharing', price: 12000, status: 'occupied' },
          ]
        }
      ]);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching hostels:', error);
      setLoading(false);
    }
  };

  const handleAddHostel = async (e) => {
    e.preventDefault();
    // Add your hostel creation logic here
    const newHostelData = {
      id: hostels.length + 1,
      ...newHostel,
      occupiedRooms: 0,
      rooms: []
    };
    setHostels([...hostels, newHostelData]);
    setShowAddForm(false);
    setNewHostel({ name: '', gender: 'male', totalRooms: '', description: '' });
  };

  const handleAddRoom = async (e) => {
    e.preventDefault();
    if (!selectedHostel) return;

    const newRoomData = {
      id: Math.random(),
      ...newRoom
    };

    const updatedHostels = hostels.map(hostel => {
      if (hostel.id === selectedHostel.id) {
        return {
          ...hostel,
          rooms: [...hostel.rooms, newRoomData]
        };
      }
      return hostel;
    });

    setHostels(updatedHostels);
    setShowRoomForm(false);
    setNewRoom({ roomNumber: '', type: 'single', price: '', status: 'available' });
  };

  const handleDeleteHostel = async (hostelId) => {
    if (window.confirm('Are you sure you want to delete this hostel?')) {
      setHostels(hostels.filter(hostel => hostel.id !== hostelId));
    }
  };

  const filteredHostels = hostels.filter(hostel =>
    hostel.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div
      className="manage-hostels-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="header-actions">
        <h2>Manage Hostels</h2>
        <div className="action-buttons">
          <div className="search-bar">
            <FaSearch />
            <input
              type="text"
              placeholder="Search hostels..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="add-button" onClick={() => setShowAddForm(true)}>
            <FaPlus /> Add New Hostel
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading hostels...</div>
      ) : (
        <div className="hostels-grid">
          {filteredHostels.map(hostel => (
            <motion.div
              key={hostel.id}
              className="hostel-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="hostel-header">
                <FaBuilding className="hostel-icon" />
                <h3>{hostel.name}</h3>
                <div className="hostel-actions">
                  <button onClick={() => handleDeleteHostel(hostel.id)}>
                    <FaTrash />
                  </button>
                </div>
              </div>

              <div className="hostel-info">
                <p><strong>Gender:</strong> {hostel.gender}</p>
                <p><strong>Total Rooms:</strong> {hostel.totalRooms}</p>
                <p><strong>Occupied:</strong> {hostel.occupiedRooms}</p>
                <p className="description">{hostel.description}</p>
              </div>

              <div className="rooms-section">
                <div className="rooms-header">
                  <h4>Rooms</h4>
                  <button 
                    className="add-room-button"
                    onClick={() => {
                      setSelectedHostel(hostel);
                      setShowRoomForm(true);
                    }}
                  >
                    <FaPlus /> Add Room
                  </button>
                </div>

                <div className="rooms-grid">
                  {hostel.rooms.map(room => (
                    <div key={room.id} className="room-card">
                      <div className="room-header">
                        <FaBed />
                        <span>{room.roomNumber}</span>
                      </div>
                      <div className="room-details">
                        <p>Type: {room.type}</p>
                        <p>Price: KES {room.price}</p>
                        <span className={`status ${room.status}`}>
                          {room.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Hostel Form Modal */}
      {showAddForm && (
        <div className="modal-overlay">
          <motion.div 
            className="modal-content"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <h3>Add New Hostel</h3>
            <form onSubmit={handleAddHostel}>
              <div className="form-group">
                <label>Hostel Name</label>
                <input
                  type="text"
                  value={newHostel.name}
                  onChange={(e) => setNewHostel({...newHostel, name: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Gender</label>
                <select
                  value={newHostel.gender}
                  onChange={(e) => setNewHostel({...newHostel, gender: e.target.value})}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <div className="form-group">
                <label>Total Rooms</label>
                <input
                  type="number"
                  value={newHostel.totalRooms}
                  onChange={(e) => setNewHostel({...newHostel, totalRooms: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={newHostel.description}
                  onChange={(e) => setNewHostel({...newHostel, description: e.target.value})}
                  required
                />
              </div>

              <div className="modal-actions">
                <button type="submit" className="submit-button">Add Hostel</button>
                <button 
                  type="button" 
                  className="cancel-button"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Add Room Form Modal */}
      {showRoomForm && selectedHostel && (
        <div className="modal-overlay">
          <motion.div 
            className="modal-content"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <h3>Add New Room to {selectedHostel.name}</h3>
            <form onSubmit={handleAddRoom}>
              <div className="form-group">
                <label>Room Number</label>
                <input
                  type="text"
                  value={newRoom.roomNumber}
                  onChange={(e) => setNewRoom({...newRoom, roomNumber: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Room Type</label>
                <select
                  value={newRoom.type}
                  onChange={(e) => setNewRoom({...newRoom, type: e.target.value})}
                >
                  <option value="single">Single</option>
                  <option value="sharing">Sharing</option>
                </select>
              </div>

              <div className="form-group">
                <label>Price (KES)</label>
                <input
                  type="number"
                  value={newRoom.price}
                  onChange={(e) => setNewRoom({...newRoom, price: e.target.value})}
                  required
                />
              </div>

              <div className="modal-actions">
                <button type="submit" className="submit-button">Add Room</button>
                <button 
                  type="button" 
                  className="cancel-button"
                  onClick={() => setShowRoomForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default ManageHostels; 