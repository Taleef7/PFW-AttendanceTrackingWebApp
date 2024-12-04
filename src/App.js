import Login from './pages/login';
import Register from './pages/signUp';
import ForgotPassword from './pages/forgotPassword';
import CourseDashboard from './pages/courseDashboard';
import './App.css';
import './../src/styles/styles.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import SemesterManagement from './components/SemesterManagement'; // Import Semester Management
import CourseManagement from './components/CourseManagement';
import CoursePage from './pages/courseDashboard'; // Import CoursePage for specific course dashboards
import ScanQR from './pages/scanQR';


function App() {
  return (
    <Router>
      <Routes>
        {/* Authentication Routes */}
        <Route path="/" element={<Navigate to="/login" />} /> {/* Redirect to /login */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Dashboard and Management Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/coursedashboard" element={<CourseDashboard />} />
        <Route path="/semester-management" element={<SemesterManagement />} />
        <Route path="/course-management" element={<CourseManagement />} />

        {/* Specific Course Dashboard */}
        <Route path="/course-dashboard/:courseName" element={<CoursePage />} />

        {/*Scan QR */}
        <Route path="/scan-qr" element={<ScanQR />} />
      </Routes>
    </Router>
  );
}

export default App;
