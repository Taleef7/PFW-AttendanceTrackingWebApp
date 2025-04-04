import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Link, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';
import "./../styles/styles.css";
import logo from "./../assets/logo.jpg";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const getErrorMessage = (err) => {
    console.log("Received Error:", err);
    const errorCode = err.code || err.message || err;
    switch (errorCode) {
      case "auth/user-not-found":
        return "No account found with this email. Please register.";
      case "auth/wrong-password":
        return "Incorrect password. Please try again.";
      case "Invalid Credentials":
        return "Please check credentials and try again.";
      default:
        return `An error occurred: ${errorCode}`;
    }
  };

  const validatePFWEmail = (email) => {
    return /^[^\s@]+@pfw\.edu$/.test(email);
  };

  const handleLogin = async () => {
    if (!validatePFWEmail(email)) {
      setError("Please enter a valid @pfw.edu email address.");
      return;
    }

    if (!password) {
      setError("Password is required.");
      return;
    }

    try {
      await login(email, password);
      navigate('/dashboard');  
    } catch (err) {
      setError(getErrorMessage(err));
    }
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
        <Box className="left-section">
          <img src={logo} alt="Logo" className="logo-image" />
        </Box>
        <Box className="right-section">
          <Typography className="logo-text">Login</Typography>

          <TextField
            variant="outlined"
            id="email-input"
            data-testid="email-input"
            label="Email"
            type="email"
            fullWidth
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError(null);
            }}
            error={!!error && error.includes("@pfw.edu")}
            helperText={!!error && error.includes("@pfw.edu") ? error : ""}
          />

          <TextField
            variant="outlined"
            id="password-input"
            data-testid="password-input"
            label="Password"
            type="password"
            fullWidth
            required
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(null);
            }}
            error={!!error && error.includes("Password")}
            helperText={!!error && error.includes("Password") ? error : ""}
          />

          <Button
            variant="contained"
            className="login-button"
            onClick={handleLogin}
            sx={{ marginTop: '1rem' }}
            data-testid="login-button"
          >
            Log in
          </Button>

          {error && (
            <Box sx={{ marginTop: '10px' }}>
              <Alert severity="error" data-testid="error-message">
                {error}
              </Alert>
            </Box>
          )}

          <Box className="link-section">
            <Typography variant="body2" className="link" onClick={handleForgotPassword}>
              Forgot password?
            </Typography>
          </Box>

          <Box className="link-section">
            <Typography variant="body2">Don't have an account?</Typography>
            <Link
              component="button"
              className="link"
              onClick={handleRegister}
              data-testid="register-link"
            >
              Sign up
            </Link>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
