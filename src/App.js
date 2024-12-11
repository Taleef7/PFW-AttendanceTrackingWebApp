import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/signUp";
import ForgotPassword from "./pages/forgotPassword";
import Dashboard from "./pages/Dashboard";
import SemesterManagement from "./components/SemesterManagement";
import CourseManagementPage from "./components/CourseManagement"; // Specific Course Management Page
import CourseDashboard from "./pages/courseDashboard"; // Specific Course Dashboard
import ScanQR from "./pages/scanQR";
import StudentList from "./components/StudentList";
import StudentReport from "./components/StudentReport";
import GenerateReport from "./components/GenerateReport";
import Analytics from "./components/Analytics";
import Navbar from "./components/Navbar"; // New Navbar component
import "./App.css";
import "./../src/styles/styles.css";

const AppRoutes = () => {
  const location = useLocation();

  // Define routes where Navbar should not be displayed
  const noNavbarRoutes = ["/login", "/register", "/forgot-password"];

  return (
    <>
      {/* Conditionally render Navbar */}
      {!noNavbarRoutes.includes(location.pathname) && <Navbar />}

      <Routes>
        {/* Authentication Routes */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Dashboard and Management Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/semester-management" element={<SemesterManagement />} />
        <Route path="/course-management/:semesterId" element={<CourseManagementPage />} />

        {/* Specific Course Dashboard */}
        <Route path="/course-dashboard/:courseId" element={<CourseDashboard />} />
        <Route path="/student-list/:courseId" element={<StudentList />} />
        <Route path="/student-report/:courseId" element={<StudentReport />} />
        <Route path="/generate-report/:courseId" element={<GenerateReport />} />
        <Route path="/analytics/:courseId" element={<Analytics />} />

        {/* Scan QR */}
        <Route path="/scan-qr/:courseName" element={<ScanQR />} />

        {/* Fallback for undefined routes */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </>
  );
};

const App = () => (
  <Router>
    <AppRoutes />
  </Router>
);

export default App;
