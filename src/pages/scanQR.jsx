// src/ScanQR.jsx
import React, { useState, useEffect } from "react";
import Webcam from "react-webcam";
import { Box, Typography } from "@mui/material";

const ScanQR = () => {
  const [cameraAccess, setCameraAccess] = useState(null); // null: not checked, true: allowed, false: denied

  useEffect(() => {
    // Request camera permissions as soon as the page loads
    const requestCameraAccess = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (stream) {
          setCameraAccess(true); // Camera access granted
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
        setCameraAccess(false); // Camera access denied
      }
    };

    requestCameraAccess();
  }, []);

  const videoConstraints = {
    facingMode: "environment", // Use the back camera if available
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f9f9f9",
        padding: 2,
      }}
    >
      <Typography variant="h4" sx={{ marginBottom: 3 }}>
        Scan QR Code
      </Typography>

      {cameraAccess === null && (
        <Typography variant="body1" sx={{ marginBottom: 3 }}>
          Requesting camera permissions...
        </Typography>
      )}

      {cameraAccess === false && (
        <Typography
          variant="body1"
          sx={{ color: "red", textAlign: "center", marginBottom: 3 }}
        >
          Unable to access the camera. Please grant permissions in your browser settings.
        </Typography>
      )}

      {cameraAccess === true && (
        <Box
          sx={{
            width: 300,
            height: 300,
            border: "2px solid #673ab7",
            borderRadius: "8px",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <Webcam
            videoConstraints={videoConstraints}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              position: "absolute",
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default ScanQR;
