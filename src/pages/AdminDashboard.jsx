import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import AdminSidebar from "../components/admin/AdminSidebar";
import ManageHostels from "../components/admin/ManageHostels";
import ManageStudents from "../components/admin/ManageStudents";
import ViewBookings from "../components/admin/ViewBookings";
import ViewComplaints from "../components/admin/ViewComplaints";
import ManageFeedback from "../components/admin/ManageFeedback";
import "../css/AdminDashboard.css";

// Import background images
import hostelImage5 from "../images/hostelimage5.jpg";
import hostelImage6 from "../images/hostelimage6.jpg";
import hostelImage7 from "../images/hostelimage7.jpg";
import hostelImage8 from "../images/hostelimage8.jpg";

const images = [hostelImage5, hostelImage6, hostelImage7, hostelImage8];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("hostels");
  const [bgIndex, setBgIndex] = useState(0);
  const [adminName, setAdminName] = useState("Loading...");

  useEffect(() => {
    // Auto-change background every 5 seconds
    const interval = setInterval(() => {
      setBgIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    // Fetch admin name from database
    const fetchAdminName = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setAdminName("Guest");
          return;
        }

        const response = await axios.get("http://localhost:5000/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setAdminName(response.data.name); // Assuming `name` is stored in the DB
      } catch (error) {
        console.error("Error fetching admin name:", error);
        setAdminName("Error loading name");
      }
    };

    fetchAdminName();

    return () => clearInterval(interval);
  }, []);

  // Function to render the active component
  const renderComponent = () => {
    switch (activeTab) {
      case "hostels":
        return <ManageHostels />;
      case "students":
        return <ManageStudents />;
      case "bookings":
        return <ViewBookings />;
      case "complaints":
        return <ViewComplaints />;
      case "feedback":
        return <ManageFeedback />;
      default:
        return <ManageHostels />;
    }
  };

  return (
    <div
      className="w-full min-h-screen flex text-white relative"
      style={{
        backgroundImage: `url(${images[bgIndex]})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "scroll",
      }}
    >
      {/* Sidebar */}
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <div className="flex-1 p-4 ml-64">
        {/* Welcome Message */}
        <motion.div
          className="welcome-message mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-white">
            Welcome, {adminName}
          </h1>
          <p className="text-gray-300 mt-2">
            Manage your hostel system efficiently
          </p>
        </motion.div>

        {/* Dashboard Stats */}
        <motion.div
          className="stats-container mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="stat-card">
              <h3>Total Students</h3>
              <p className="number">350</p>
            </div>
            <div className="stat-card">
              <h3>Available Rooms</h3>
              <p className="number">45</p>
            </div>
            <div className="stat-card">
              <h3>Active Bookings</h3>
              <p className="number">305</p>
            </div>
            <div className="stat-card">
              <h3>Pending Complaints</h3>
              <p className="number">8</p>
            </div>
          </div>
        </motion.div>

        {/* Content Area */}
        <motion.div
          className="content-area"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {renderComponent()}
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="w-full py-4 text-center bg-black bg-opacity-50 backdrop-blur-sm fixed bottom-0">
        <p className="text-white text-sm">
          &copy; 2025 DeKUT Online Hostel Booking System. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
};

export default AdminDashboard;
