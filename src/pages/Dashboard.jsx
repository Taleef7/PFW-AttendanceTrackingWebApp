import React, { useEffect, useState } from "react";
import SemesterManagement from "../components/SemesterManagement";
import { auth } from "../services/firebaseConfig"; // Import auth to get current user info
import "../styles/dashboard.css"; // Optional: Add CSS for better structure

function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user); // Update the user state when Firebase authentication state changes
      setLoading(false); // Set loading to false once the user state is set
    });

    return () => unsubscribe();
  }, []);

  // If the user state is still loading, show a loading spinner or placeholder
  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="main">
          <div className="dashboard-header" style={{ padding: "1rem", textAlign: "center" }}>
            <h1>Loading...</h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="main">
        <div className="dashboard-header" style={{ padding: "1rem", textAlign: "center" }}>
          <h1>Welcome, {user ? user.email : "Instructor"}!</h1>
        </div>
        <div className="dashboard-content" style={{ padding: "1rem" }}>
          {/* Semester Management Section */}
          <SemesterManagement instructorId={user?.uid} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
