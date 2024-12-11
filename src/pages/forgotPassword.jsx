import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Link,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { sendPasswordReset } from "../services/authService";
import "./../styles/styles.css";
import logo from "./../assets/logo.jpg";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSendResetEmail = async () => {
    const response = await sendPasswordReset(email);
    setMessage(response);
    if (response === "Password reset email sent. Please check your inbox.") {
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    }
  };

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  return (
    <Container className="login-page">
      <Box className="login-container">
        <Box className="left-section">
          <img src={logo} alt="Logo" className="logo-image" />
        </Box>
        <Box className="right-section">
          <Typography className="logo-text">Forgot Password</Typography>

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

          <Button
            fullWidth
            variant="contained"
            color="primary"
            className="login-button"
            onClick={handleSendResetEmail}
            sx={{ marginTop: "1.5rem" }}
          >
            Send Password Reset Email
          </Button>

          {message && (
            <Typography sx={{ marginTop: "1.5rem", color: "green" }}>
              {message}
            </Typography>
          )}

          <Box className="link-section" sx={{ marginTop: "1rem" }}>
            <Link
              component="button"
              className="link"
              onClick={handleLoginRedirect}
            >
              Back to Login
            </Link>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default ForgotPassword;
