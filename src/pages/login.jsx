import React from 'react';
import { Container, TextField, Button, Typography, Box, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import "./../styles/styles.css";
import logo from "./../assets/logo.jpg"

const Login = () => {
    const navigate = useNavigate();

    const handleLogin = () => {
        // Handle login logic here
        navigate('/dashboard');
      };
  
    const handleRegister = () => {
      navigate('/register');
    };
  
    const handleForgotPassword = () => {
      navigate('/forgot-password');
    };

  return (
    <Container className="login-page">
      <Box className="login-container">
        
        {/* Left section for logo/image */}
        <Box className="left-section">
          <img src={logo} alt="Logo" className="logo-image" /> {/* Replace with actual image path */}
        </Box>
        
        {/* Right section for login form */}
        <Box className="right-section">
          <Typography className="logo-text">Login</Typography>

          <TextField
            variant="outlined"
            label="Phone number, username, or email"
            fullWidth
            required
          />

          <TextField
            variant="outlined"
            label="Password"
            type="password"
            fullWidth
            required
          />

          <Button variant="contained" className="login-button"   onClick={handleLogin}>
            Log in
          </Button>

          <Box className="link-section">
            <Typography variant="body2"  className="link" onClick={handleForgotPassword}>Forgot password?</Typography>
          </Box>

          <Box className="link-section">
            <Typography variant="body2">Don't have an account?</Typography>
            <Link component="button" className="link" onClick={handleRegister}>Sign up</Link>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;