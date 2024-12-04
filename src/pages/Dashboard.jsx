import React from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./../components/Sidebar";
import SemesterManagement from "../components/SemesterManagement";
import { logout } from "../services/authService"; // Import logout function
import { auth } from "../services/firebaseConfig"; // Import auth to get current user info
// import CourseManagement from '../components/CourseManagement';
import "../styles/dashboard.css"; // Optional: Add CSS for better structure

function Dashboard() {
  const navigate = useNavigate();

  // Handle Logout Functionality
  const handleLogout = async () => {
    try {
      await logout(); // Call the logout function
      alert("Logged out successfully!");
      navigate("/login"); // Redirect to login page after logout
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar onLogout={handleLogout} /> {/* Sidebar with logout functionality */}
      <div className="main">
        <div className="dashboard-header">
          <h1>Welcome, {auth.currentUser?.email || "Instructor"}!</h1>
        </div>
        <div className="dashboard-content">
          {/* Semester Management Component */}
          <SemesterManagement instructorId={auth.currentUser?.uid} /> {/* Pass current instructor's UID */}
          {/* <CourseManagement /> */}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
