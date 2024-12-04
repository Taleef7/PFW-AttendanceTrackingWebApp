import Login from './pages/login';
import Register from './pages/signUp';
import ForgotPassword from './pages/forgotPassword';
import CourseDashboard from './pages/courseDashboard';
import './App.css';
import './../src/styles/styles.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import SemesterManagement from './components/SemesterManagement'; // Import Semester Management
import CourseManagement from './components/CourseManagement';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/coursedashboard" element={<CourseDashboard/>} />
        <Route path="/semester-management" element={<SemesterManagement />} /> {/* New route */}
        <Route path="/course-management" element={<CourseManagement />} /> {/* New route */}
      </Routes>
    </Router>
  );
}

export default App;
