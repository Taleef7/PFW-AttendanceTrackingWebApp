import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { signup } from '../services/authService'; // Import the signup function
import "./../styles/styles.css";
import logo from "./../assets/logo.jpg";

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await signup(email, password); // Call signup function from authService.js
      alert("Registration successful! Please log in.");
      navigate('/login');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLoginRedirect = () => {
    navigate('/login');
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
          >
            Register
          </Button>

          {error && <Typography style={{ color: 'red', marginTop: '10px' }}>{error}</Typography>}

          <Box className="link-section">
            <Typography variant="body2">Have an account?</Typography>
            <Link component="button" className="link" onClick={handleLoginRedirect}>
              Login
            </Link>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Register;
