import React from "react";

function LandingNavBar({ setActiveTab }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top w-100 shadow">
      <a className="navbar-brand" href="#">DEKUT ONLINE HOSTEL BOOKING</a>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
        <ul className="navbar-nav">
          <li className="nav-item active">
            <button
              className="nav-link" 
              onClick={() => setActiveTab("home")}
            >
              Home
            </button>
          </li>
          <li className="nav-item">
            <button 
              className="nav-link" 
              onClick={() => setActiveTab("register")}
            >
              Register as Student
            </button>
          </li>
          <li className="nav-item">
            <button 
              className="nav-link" 
              onClick={() => setActiveTab("loginStudent")}
            >
              Login as Student
            </button>
          </li>
          <li className="nav-item">
            <button 
              className="nav-link" 
              onClick={() => setActiveTab("loginAdmin")}
            >
              Login as Admin
            </button>
          </li>
          <li className="nav-item">
            <button 
              className="nav-link" 
              onClick={() => setActiveTab("registerAdmin")}
            >
              Register as Admin
            </button>
          </li>
          <li className="nav-item">
            <button
              className="nav-link" 
              onClick={() => setActiveTab("about")}
            >
              About us
            </button>
          </li>
          <li className="nav-item">
            <button
              className="nav-link" 
              onClick={() => setActiveTab("contact")}
            >
              Contact Us
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default LandingNavBar;
