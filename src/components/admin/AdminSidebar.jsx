import { motion } from "framer-motion";
import { 
  FaBuilding, 
  FaUsers, 
  FaBookmark, 
  FaExclamationCircle, 
  FaComments, 
  FaSignOutAlt 
} from 'react-icons/fa';
import '../../css/AdminSidebar.css';

const AdminSidebar = ({ activeTab, setActiveTab }) => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <motion.div
      className="admin-sidebar"
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="logo-section">
        <h2>Admin Dashboard</h2>
      </div>

      <nav className="nav-links">
        <button
          className={`nav-link ${activeTab === "hostels" ? "active" : ""}`}
          onClick={() => setActiveTab("hostels")}
        >
          <FaBuilding /> Manage Hostels
        </button>

        <button
          className={`nav-link ${activeTab === "students" ? "active" : ""}`}
          onClick={() => setActiveTab("students")}
        >
          <FaUsers /> Manage Students
        </button>

        <button
          className={`nav-link ${activeTab === "bookings" ? "active" : ""}`}
          onClick={() => setActiveTab("bookings")}
        >
          <FaBookmark /> View Bookings
        </button>

        <button
          className={`nav-link ${activeTab === "complaints" ? "active" : ""}`}
          onClick={() => setActiveTab("complaints")}
        >
          <FaExclamationCircle /> View Complaints
        </button>

        <button
          className={`nav-link ${activeTab === "feedback" ? "active" : ""}`}
          onClick={() => setActiveTab("feedback")}
        >
          <FaComments /> Manage Feedback
        </button>
      </nav>

      <button className="logout-button" onClick={handleLogout}>
        <FaSignOutAlt /> Logout
      </button>
    </motion.div>
  );
};

export default AdminSidebar; 