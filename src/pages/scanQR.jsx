import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Snackbar, Alert, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack"; // Back arrow icon
import QrScanner from "qr-scanner"; // Import QR scanning library
import { doc, getDoc, addDoc, collection } from "firebase/firestore";
import { db } from "../services/firebaseConfig";

const ScanQR = () => {
  const { courseName } = useParams(); // Get the course name dynamically
  const [error, setError] = useState(null); // To handle camera errors
  const [successMessage, setSuccessMessage] = useState(null); // Snackbar for success messages
  const [errorMessage, setErrorMessage] = useState(null); // Snackbar for error messages
  const videoRef = useRef(null); // Reference to the video element
  const scannerRef = useRef(null); // Reference to the QR scanner instance
  const navigate = useNavigate(); // For navigation

  useEffect(() => {
    const startCamera = async () => {
      try {
        // Request camera access
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "environment", // Use the back camera
          },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.onloadedmetadata = () => videoRef.current.play();
        }
      } catch (err) {
        setError("Unable to access camera. Please check your permissions.");
        console.error("Camera error:", err);
      }
    };

    startCamera();

    return () => {
      // Stop the camera and scanner when the component unmounts
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      }
      if (scannerRef.current) {
        scannerRef.current.stop();
      }
    };
  }, []);

  const validateQRCode = async (qrData) => {
    try {
      const { studentId, courseId, timestamp } = JSON.parse(qrData);

      // Ensure the scanned QR code matches the course
      if (courseId !== courseName) {
        throw new Error("This QR code does not match the current course.");
      }

      // Check if the student exists in Firestore
      const studentRef = doc(db, "students", studentId);
      const studentDoc = await getDoc(studentRef);
      if (!studentDoc.exists()) {
        throw new Error("Student does not exist.");
      }

      // Mark attendance in Firestore
      await addDoc(collection(db, "attendanceSummaries"), {
        studentId,
        courseId,
        timestamp: new Date().toISOString(),
        status: "present",
      });

      setSuccessMessage("Attendance marked successfully!");
    } catch (err) {
      console.error("QR Code Validation Error:", err);
      setErrorMessage(err.message || "Failed to validate QR code.");
    }
  };

  const handleQRCodeScan = async () => {
    if (!videoRef.current) return;
    const videoElement = videoRef.current;

    if (!scannerRef.current) {
      scannerRef.current = new QrScanner(
        videoElement,
        (result) => {
          validateQRCode(result.data);
          scannerRef.current.stop(); // Stop scanning after a successful scan
        },
        {
          returnDetailedScanResult: true,
        }
      );
    }

    scannerRef.current.start(); // Start scanning
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center", // Centers content vertically
        height: "100vh",
        padding: "1rem",
        position: "relative", // For back button positioning
      }}
    >
      {/* Back Button */}
      <IconButton
        onClick={() => navigate(`/course-dashboard/${courseName}`)}
        sx={{
          position: "absolute",
          top: "1rem",
          left: "1rem",
        }}
      >
        <ArrowBackIcon />
      </IconButton>

      {/* Header */}
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
            display: "flex",
            justifyContent: "center", // Centers the video horizontally
            alignItems: "center", // Centers the video vertically
            position: "relative",
            overflow: "hidden",
            borderRadius: "8px",
            border: "2px solid #673ab7",
          }}
        >
          {/* Video Element */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            onLoadedData={handleQRCodeScan}
          />
        </Box>
      )}

      {/* Success Snackbar */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage(null)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          severity="success"
          onClose={() => setSuccessMessage(null)}
          sx={{ width: "100%" }}
        >
          {successMessage}
        </Alert>
      </Snackbar>

      {/* Error Snackbar */}
      <Snackbar
        open={!!errorMessage}
        autoHideDuration={3000}
        onClose={() => setErrorMessage(null)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          severity="error"
          onClose={() => setErrorMessage(null)}
          sx={{ width: "100%" }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ScanQR;
