import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import LandingNavBar from "./components/LandingNavBar";
import LoginStudent from "./components/LoginStudent";
import AboutUs from "./components/AboutUs";
import ContactUs from "./components/ContactUs";
import LoginAdmin from "./components/LoginAdmin";
import Register from "./components/Register";
import RegisterAdmin from "./components/RegisterAdmin";
import AdminSidebar from "./components/admin/AdminSidebar";
import ManageFeedback from "./components/admin/ManageFeedback";
import ManageHostels from "./components/admin/ManageHostels";
import ViewBookings from "./components/admin/ViewBookings";
import ViewComplaints from "./components/admin/ViewComplaints";
import BookHostel from "./components/dashboard/BookHostel";
import Complaints from "./components/dashboard/Complaints";
import Feedback from "./components/dashboard/Feedback";
import Profile from "./components/dashboard/Profile";
import RoomDetails from "./components/dashboard/RoomDetails";
import Sidebar from "./components/dashboard/Sidebar";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/login-student" element={<LoginStudent />} />
        <Route path="/landing-nav-bar" element={<LandingNavBar />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/login-admin" element={<LoginAdmin />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register-admin" element={<RegisterAdmin />} />
        <Route path="/admin-sidebar" element={<AdminSidebar />} />
        <Route path="/manage-feedback" element={<ManageFeedback />} />
        <Route path="/manage-hostels" element={<ManageHostels />} />
        <Route path="/view-bookings" element={<ViewBookings />} />
        <Route path="/view-complaints" element={<ViewComplaints />} />
        <Route path="/book-hostel" element={<BookHostel />} />
        <Route path="/complaints" element={<Complaints />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/room-details" element={<RoomDetails />} />
        <Route path="/sidebar" element={<Sidebar />} />
      </Routes>
    </Router>
  );
}

export default App;
