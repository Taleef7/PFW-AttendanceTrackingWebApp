import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar"; // New Navbar component
import SemesterManagement from "../components/SemesterManagement";
import { logout } from "../services/authService"; // Import logout function
import { auth } from "../services/firebaseConfig"; // Import auth to get current user info
import "../styles/dashboard.css"; // Optional: Add CSS for better structure

function Dashboard() {
  const navigate = useNavigate();

  // Handle Logout Functionality
  const handleLogout = async () => {
    try {
      await logout(); // Call the logout function
      navigate("/login"); // Redirect to login page after logout
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  };

  return (
    <div className="dashboard-container">
      {/* Navbar Component */}
      <Navbar onLogout={handleLogout} />

      {/* Main Dashboard Content */}
      <div className="main">
        <div className="dashboard-header" style={{ padding: "1rem", textAlign: "center" }}>
          <h1>Welcome, {auth.currentUser?.email || "Instructor"}!</h1>
        </div>
        <div className="dashboard-content" style={{ padding: "1rem" }}>
          {/* Semester Management Section */}
          <SemesterManagement instructorId={auth.currentUser?.uid} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
