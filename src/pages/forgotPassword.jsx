// src/ForgotPassword.js

import React from 'react';
import { Container, TextField, Button, Typography, Box, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import "./../styles/styles.css";
import logo from "./../assets/logo.jpg";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const handlePasswordReset = () => {
    // Handle password reset logic here
  };

  const handleLoginRedirect = () => {
    // Navigate to login page
    navigate('/login');
  };

  return (
    <Container className="login-page">
      <Box className="login-container">
        <Box className="left-section">
          <img src={logo} alt="Logo" className="logo-image" /> {/* Replace with actual image path */}
        </Box>
        <Box className="right-section">
        <Typography className="logo-text">
          Forgot Password
        </Typography>
        
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          label="Email"
          type="email"
          helperText="Enter your email to receive password reset instructions."
        />

        <Button
          fullWidth
          variant="contained"
          color="primary"
          className="login-button"  
          onClick={handlePasswordReset}
        >
          Send Reset Link
        </Button>

        <Box className="link-section">
          <Link component="button" className="link" onClick={handleLoginRedirect}>
            Back to Login
          </Link>
        </Box>
      </Box>
      </Box>
    </Container>
  );
};

export default ForgotPassword;
