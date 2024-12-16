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
import Navbar from "./components/Navbar"; // Navbar component
import Footer from "./components/Footer"; // Footer component
import "./App.css";
import "./../src/styles/styles.css";
import { Box } from "@mui/material";


const AppRoutes = () => {
  const location = useLocation();

  // Define routes where Navbar and Footer should not be displayed
  const noNavbarFooterRoutes = ["/login", "/register", "/forgot-password"];

  return (
    <>
      {/* Conditionally render Navbar */}
      {!noNavbarFooterRoutes.includes(location.pathname) && <Navbar />}

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
        <Route path="/scan-qr/:courseId" element={<ScanQR />} />

        {/* Fallback for undefined routes
        <Route path="*" element={<Navigate to="/login" />} /> */}
      </Routes>

      {/* Conditionally render Footer */}
      {!noNavbarFooterRoutes.includes(location.pathname) && <Footer />}
    </>
  );
};

const App = () => (
  <Router>
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh",
    }}
  >
    <AppRoutes />
  </Box>
</Router>
);

export default App;
