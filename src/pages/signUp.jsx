import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Link, Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { signup } from '../services/authService';
import "./../styles/styles.css";
import logo from "./../assets/logo.jpg";

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Snackbar state
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationSeverity, setNotificationSeverity] = useState('success'); // success | error

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setNotificationMessage("Passwords do not match.");
      setNotificationSeverity("error");
      setNotificationOpen(true);
      return;
    }

    setLoading(true);
    try {
      await signup(email, password);
      setNotificationMessage("Registration successful! Please check your email to verify your account.");
      setNotificationSeverity("success");
      setNotificationOpen(true);

      // Redirect after successful signup
      setTimeout(() => {
        navigate('/login');
      }, 3000); // Allow user to see the notification before redirecting
    } catch (err) {
      setNotificationMessage(err.message || "Signup failed. Please try again.");
      setNotificationSeverity("error");
      setNotificationOpen(true);
    }
    setLoading(false);
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  const handleNotificationClose = () => {
    setNotificationOpen(false);
  };

  return (
    <Container className="login-page">
      <Box className="login-container">
        <Box className="left-section">
          <img src={logo} alt="Logo" className="logo-image" />
        </Box>
        <Box className="right-section">
          <Typography className="logo-text">Register</Typography>

          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <Button
            fullWidth
            variant="contained"
            color="primary"
            className="login-button"
            onClick={handleRegister}
            disabled={loading}
          >
            Register
          </Button>

          {error && <Typography style={{ color: 'red', marginTop: '10px' }}>{error}</Typography>}

          <Box className="link-section">
            <Typography variant="body2">Already have an account?</Typography>
            <Link component="button" className="link" onClick={handleLoginRedirect}>
              Login
            </Link>
          </Box>
        </Box>
      </Box>

      {/* Notification Snackbar */}
      <Snackbar
        open={notificationOpen}
        autoHideDuration={3000}
        onClose={handleNotificationClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleNotificationClose} severity={notificationSeverity} sx={{ width: '100%' }}>
          {notificationMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Register;
