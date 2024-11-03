// src/ForgotPassword.js

import React from 'react';
import { Container, TextField, Button, Typography, Box, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';

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
    <Container maxWidth="xs">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: 8,
          padding: 3,
          boxShadow: 3,
          borderRadius: 2,
        }}
      >
        <Typography variant="h5" gutterBottom>
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
          sx={{ mt: 2 }}
          onClick={handlePasswordReset}
        >
          Send Reset Link
        </Button>

        <Box sx={{ mt: 2 }}>
          <Link component="button" variant="body2" onClick={handleLoginRedirect}>
            Back to Login
          </Link>
        </Box>
      </Box>
    </Container>
  );
};

export default ForgotPassword;
