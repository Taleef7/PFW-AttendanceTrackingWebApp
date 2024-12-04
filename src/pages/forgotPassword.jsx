// src/ForgotPassword.js
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
import "./../styles/styles.css";
import logo from "./../assets/logo.jpg";

const ForgotPassword = () => {
  const navigate = useNavigate();

  // State management
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  // Handle OTP sending
  const handleSendOtp = () => {
    if (email.trim()) {
      setOtpSent(true); // Simulate OTP being sent
      console.log(`OTP sent to: ${email}`); // Simulate API call
    } else {
      alert("Please enter your email.");
    }
  };

  // Handle OTP verification
  const handleVerifyOtp = () => {
    console.log(`Entered OTP: ${otp}`);
    // Add OTP verification logic here
  };

  // Handle Resend OTP
  const handleResendOtp = () => {
    console.log(`Resending OTP to: ${email}`);
    // Logic for resending OTP
  };

  // Handle Email Reset
  const handleChangeEmail = () => {
    setOtpSent(false); // Reset OTP state
    setOtp(""); // Clear OTP input
  };

  // Redirect to login
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
            helperText={
              otpSent
                ? `The verification code has been sent to "${email}".`
                : "Enter your email to receive an OTP."
            }
          />

          {otpSent && (
            <>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label="Enter OTP"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />

              <Button
                fullWidth
                variant="contained"
                color="primary"
                className="login-button"
                onClick={handleVerifyOtp}
                sx={{ marginTop: "1.5rem" }}
              >
                Verify OTP
              </Button>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "1rem",
                }}
              >
                <Button
                  variant="text"
                  color="primary"
                  onClick={handleResendOtp}
                  sx={{ flex: 1, marginRight: "0.5rem" }}
                >
                  Resend OTP
                </Button>
                <Button
                  variant="text"
                  color="primary"
                  onClick={handleChangeEmail}
                  sx={{ flex: 1, marginLeft: "0.5rem" }}
                >
                  Change Email Address
                </Button>
              </Box>
            </>
          )}

          {!otpSent && (
            <Button
              fullWidth
              variant="contained"
              color="primary"
              className="login-button"
              onClick={handleSendOtp}
              sx={{ marginTop: "1.5rem" }}
            >
              Send OTP
            </Button>
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
