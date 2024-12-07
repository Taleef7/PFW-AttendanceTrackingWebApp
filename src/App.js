import Login from './pages/login';
import Register from './pages/signUp';
import ForgotPassword from './pages/forgotPassword';
import CourseDashboard from './pages/courseDashboard'; // General Course Dashboard
import './App.css';
import './../src/styles/styles.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import SemesterManagement from './components/SemesterManagement';
import CourseManagement from './components/CourseManagement';
import SpecificCourseDashboard from './pages/courseDashboard'; // Specific Course Dashboard
import ScanQR from './pages/scanQR';

function App() {
  return (
    <Router>
      <Routes>
        {/* Authentication Routes */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Dashboard and Management Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/semester-management" element={<SemesterManagement />} />
        <Route path="/course-management" element={<CourseManagement />} />

        {/* General Course Dashboard */}
        <Route path="/coursedashboard" element={<CourseDashboard />} />

        {/* Specific Course Dashboard */}
        <Route path="/course-dashboard/:courseName" element={<SpecificCourseDashboard />} />
        <Route path="/semester-dashboard/:semesterId" element={<SpecificCourseDashboard />} />

        {/* Scan QR */}
        <Route path="/scan-qr/:courseName" element={<ScanQR />} />
      </Routes>
    </Router>
  );
}

export default App;
