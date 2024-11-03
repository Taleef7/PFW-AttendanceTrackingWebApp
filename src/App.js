import logo from './logo.svg';
import Login from './pages/login';
import Register from './pages/signUp'
import ForgotPassword from './pages/forgotPassword'
import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

function App() {
  return (
    <Router>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
    </Routes>
  </Router>
  );
}

export default App;
