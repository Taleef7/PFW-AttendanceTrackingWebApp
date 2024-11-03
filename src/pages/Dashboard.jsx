// App.js
import React from 'react';
import Sidebar from './../components/Sidebar';
import StatCard from './../components/StatCard';
import AttendanceChart from '../components/AttendanceChart';
import AttendancePieChart from '../components/AttendancePieChart';

function Dashboard() {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main">
        <div className="dashboard">
          <StatCard title="Current MRR" value="$12.4k" backgroundColor="#FFD700" />
          <StatCard title="Current Customers" value="16,601" backgroundColor="#FFD700" />
          <StatCard title="Active Customers" value="33%" backgroundColor="#333" color="#fff" />
          <StatCard title="Churn Rate" value="2%" backgroundColor="#333" color="#fff" />
          <AttendanceChart />
          <AttendancePieChart />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
