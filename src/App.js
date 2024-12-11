import Login from './pages/login';
import Register from './pages/signUp';
import ForgotPassword from './pages/forgotPassword';
import CourseDashboard from './pages/courseDashboard'; // General Course Dashboard
import './App.css';
import './../src/styles/styles.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import SemesterManagement from './components/SemesterManagement';
import CourseManagementPage from './components/CourseManagement'; // Specific Course Management Page
import SpecificCourseDashboard from './pages/courseDashboard'; // Specific Course Dashboard
import ScanQR from './pages/scanQR';
import StudentList from './components/StudentList';
import StudentReport from './components/StudentReport';
import GenerateReport from './components/GenerateReport';
import Analytics from './components/Analytics';

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
        <Route path="/course-management/:semesterId" element={<CourseManagementPage />} />

        {/* General Course Dashboard */}
        <Route path="/coursedashboard" element={<CourseDashboard />} />

        {/* Specific Course Dashboard */}
        <Route path="/course-dashboard/:courseId" element={<SpecificCourseDashboard />} />
        <Route path="/student-list/:courseId" element={<StudentList />} />
        <Route path="/student-report/:courseId" element={ <StudentReport />} />
        <Route path="/generate-report/:courseId" element= {<GenerateReport/>} />
        <Route path="/analytics/:courseId" element= {<Analytics />} />
 
        {/* Scan QR */}
        <Route path="/scan-qr/:courseName" element={<ScanQR />} />

        {/* Student List */}
        <Route path="/student-list/:courseId/:semesterId" element={<StudentList />} />
      </Routes>
    </Router>
  );
}

export default App;
