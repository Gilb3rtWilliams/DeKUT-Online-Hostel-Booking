import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Sidebar from "../components/dashboard/Sidebar";
import Profile from "../components/dashboard/Profile";
import BookHostel from "../components/dashboard/BookHostel";
import RoomDetails from "../components/dashboard/RoomDetails";
import Complaints from "../components/dashboard/Complaints";
import Feedback from "../components/dashboard/Feedback";
import "../css/StudentDashboard.css";

// Import background images
import hostelImage9 from "../images/hostelimage9.jpg";
import hostelImage10 from "../images/hostelimage10.jpg";
import hostelImage11 from "../images/hostelimage11.jpg";
import hostelImage12 from "../images/hostelimage12.jpg";

const images = [hostelImage9, hostelImage10, hostelImage11, hostelImage12];

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [bgIndex, setBgIndex] = useState(0);
  const [studentName, setStudentName] = useState("Loading...");

  useEffect(() => {
    // Auto-change background every 5 seconds
    const interval = setInterval(() => {
      setBgIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    // Fetch student name from database
    const fetchStudentName = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setStudentName("Guest");
          return;
        }

        const response = await axios.get("http://localhost:5000/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setStudentName(response.data.name); // Assuming `name` is stored in the DB
      } catch (error) {
        console.error("Error fetching student name:", error);
        setStudentName("Error loading name");
      }
    };

    fetchStudentName();

    return () => clearInterval(interval);
  }, []);

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
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <div className="flex-1 p-4">
        {/* Welcome Message */}
        <motion.div
          className="welcome-message mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-white">
            Welcome, {studentName}
          </h1>
        </motion.div>

        {/* Content Area */}
        <motion.div
          className="content-area"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {activeTab === "profile" && <Profile />}
          {activeTab === "bookHostel" && <BookHostel />}
          {activeTab === "roomDetails" && <RoomDetails />}
          {activeTab === "complaints" && <Complaints />}
          {activeTab === "feedback" && <Feedback />}
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

export default StudentDashboard;
