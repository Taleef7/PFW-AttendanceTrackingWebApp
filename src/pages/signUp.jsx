// src/Register.js

import React from 'react';
import { Container, TextField, Button, Typography, Box, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import "./../styles/styles.css";
import logo from "./../assets/logo.jpg"

const Register = () => {
  const navigate = useNavigate();
  const handleRegister = () => {
    // Handle registration logic here
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
        <Typography  className="logo-text">
          Register
        </Typography>

        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          label="Email"
          type="email"
        />
        
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          label="Password"
          type="password"
        />
        
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          label="Confirm Password"
          type="password"
        />

        <Button
          fullWidth
          variant="contained"
          color="primary"
          className="login-button"
          onClick={handleRegister}
        >
          Register
        </Button>

        
        <Box className="link-section">
        <Typography variant="body2">Have an account?</Typography>
          <Link component="button" className="link"  onClick={handleLoginRedirect}>
            Login
          </Link>
        </Box>
      </Box>
      </Box>
    </Container>
  );
};

export default Register;
