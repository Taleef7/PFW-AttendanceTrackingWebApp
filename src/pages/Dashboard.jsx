import React from "react";
import SemesterManagement from "../components/SemesterManagement";
import { auth } from "../services/firebaseConfig"; // Import auth to get current user info
import "../styles/dashboard.css"; // Optional: Add CSS for better structure

function Dashboard() {
  return (
    <div className="dashboard-container">
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
