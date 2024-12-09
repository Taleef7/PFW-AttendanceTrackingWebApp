import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";

const ScanQR = () => {
  const { courseName } = useParams(); // Get the course name dynamically
  const [error, setError] = useState(null); // To handle camera errors
  const [stream, setStream] = useState(null); // Media stream

  useEffect(() => {
    const startCamera = async () => {
      try {
        // Request camera access
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "environment", // Use the back camera
          },
        });
        setStream(mediaStream); // Save the media stream
      } catch (err) {
        setError("Unable to access camera. Please check your permissions.");
        console.error("Camera error:", err);
      }
    };

    startCamera();

    // Cleanup on component unmount
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        padding: "1rem",
      }}
    >
      <Typography variant="h4" sx={{ marginBottom: "1rem" }}>
        {courseName ? `Scan QR for ${courseName}` : "Scan QR"}
      </Typography>

      {error ? (
        <Typography color="error" variant="body1">
          {error}
        </Typography>
      ) : (
        <Box
          sx={{
            width: "300px",
            height: "300px",
            position: "relative",
            overflow: "hidden",
            borderRadius: "8px",
            border: "2px solid #673ab7",
          }}
        >
          {/* Video Element */}
          <video
            autoPlay
            playsInline
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            ref={(video) => {
              if (video && stream) {
                video.srcObject = stream;

                // Ensure video plays after metadata is loaded
                video.onloadedmetadata = () => {
                  video.play();
                };
              }
            }}
          />
        </Box>
      )}

      <Button
        variant="outlined"
        color="secondary"
        sx={{ marginTop: "1rem" }}
        onClick={() => window.history.back()}
      >
        Return to Dashboard
      </Button>
    </Box>
  );
};

export default ScanQR;
