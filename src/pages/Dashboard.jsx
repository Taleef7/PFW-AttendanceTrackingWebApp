import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './../components/Sidebar';
import SemesterManagement from '../components/SemesterManagement'; // Import SemesterManagement
import CourseManagement from '../components/CourseManagement';
import { logout } from '../services/authService'; // Import logout function
import { auth } from '../services/firebaseConfig'; // Import auth to get current user info

function Dashboard() {
  const navigate = useNavigate();

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
      {/* Pass handleLogout as a prop to Sidebar */}
      <Sidebar onLogout={handleLogout} />
      <div className="main">
        <div className="dashboard">
          <h1>Instructor Dashboard</h1>
          {/* Semester Management Component */}
          <SemesterManagement instructorId={auth.currentUser.uid} /> {/* Pass current instructor's UID */}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
