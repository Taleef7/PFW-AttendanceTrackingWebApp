import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';
import "./../styles/styles.css";
import logo from "./../assets/logo.jpg";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    try {
        await login(email, password);
        navigate('/dashboard');  
    } catch (err) {
      setError(err.message);
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
            label="Email"
            fullWidth
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            variant="outlined"
            label="Password"
            type="password"
            fullWidth
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button variant="contained" className="login-button" onClick={handleLogin}>
            Log in
          </Button>

          {error && <Typography style={{ color: 'red', marginTop: '10px' }}>{error}</Typography>}

          <Box className="link-section">
            <Typography variant="body2" className="link" onClick={handleForgotPassword}>
              Forgot password?
            </Typography>
          </Box>

          <Box className="link-section">
            <Typography variant="body2">Don't have an account?</Typography>
            <Link component="button" className="link" onClick={handleRegister}>
              Sign up
            </Link>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
