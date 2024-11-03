import React from 'react';
import { Container, TextField, Button, Typography, Box, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';

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
          Login
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

        <Button
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={handleLogin}
        >
          Login
        </Button>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, width: '100%' }}>
          <Link component="button" variant="body2" onClick={handleRegister}>
            Register
          </Link>
          <Link component="button" variant="body2" onClick={handleForgotPassword}>
            Forgot Password?
          </Link>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;