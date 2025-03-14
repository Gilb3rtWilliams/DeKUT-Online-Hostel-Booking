import { motion } from "framer-motion";
import { FaUser, FaBed, FaInfo, FaExclamationCircle, FaComments, FaSignOutAlt } from 'react-icons/fa';
import '../../css/Sidebar.css';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <motion.div
      className="sidebar"
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="logo-section">
        <h2>Student Dashboard</h2>
      </div>

      <nav className="nav-links">
        <button
          className={`nav-link ${activeTab === "profile" ? "active" : ""}`}
          onClick={() => setActiveTab("profile")}
        >
          <FaUser /> Profile
        </button>

        <button
          className={`nav-link ${activeTab === "bookHostel" ? "active" : ""}`}
          onClick={() => setActiveTab("bookHostel")}
        >
          <FaBed /> Book a Hostel
        </button>

        <button
          className={`nav-link ${activeTab === "roomDetails" ? "active" : ""}`}
          onClick={() => setActiveTab("roomDetails")}
        >
          <FaInfo /> Room Details
        </button>

        <button
          className={`nav-link ${activeTab === "complaints" ? "active" : ""}`}
          onClick={() => setActiveTab("complaints")}
        >
          <FaExclamationCircle /> Complaints
        </button>

        <button
          className={`nav-link ${activeTab === "feedback" ? "active" : ""}`}
          onClick={() => setActiveTab("feedback")}
        >
          <FaComments /> Feedback
        </button>
      </nav>

      <button className="logout-button" onClick={handleLogout}>
        <FaSignOutAlt /> Logout
      </button>
    </motion.div>
  );
};

export default Sidebar;
