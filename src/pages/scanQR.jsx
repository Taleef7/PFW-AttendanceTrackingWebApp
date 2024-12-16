import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Box, Typography, Snackbar, Alert, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import QrScanner from "qr-scanner";
import { doc, getDoc, addDoc, collection } from "firebase/firestore";
import { db } from "../services/firebaseConfig";

const ScanQR = () => {
  const { courseId} = useParams();
  const location = useLocation();
  const { semesterId, semesterName, courseName } = location.state || {};
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const videoRef = useRef(null);
  const scannerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "environment",
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
      const { studentId, courseId } = JSON.parse(qrData);

      if (courseId !== courseName) {
        throw new Error("This QR code does not match the current course.");
      }

      const studentRef = doc(db, "students", studentId);
      const studentDoc = await getDoc(studentRef);
      if (!studentDoc.exists()) {
        throw new Error("Student does not exist.");
      }

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
          scannerRef.current.stop();
        },
        {
          returnDetailedScanResult: true,
        }
      );
    }

    scannerRef.current.start();
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        // height: "100vh",
        padding: "1rem",
        position: "relative",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
          gap: "20px"
        }}
      >
        {/* Back Button */}
        <IconButton
          onClick={() =>
            navigate(`/course-dashboard/${courseId}`, {
              state: { courseName, semesterName, semesterId },
            })
          } sx={{
            backgroundColor: "#cccccc",
            "&:hover": {
              backgroundColor: "#b3b3b3",
            },
          }}
        >
          {            console.log(semesterId, courseName, semesterName)          }
          <ArrowBackIcon />
        </IconButton>

        {/* Header */}
        <Typography variant="h4">
          {courseName ? `Scan QR for ${courseName}` : "Scan QR"}
        </Typography>
      </Box>

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
            justifyContent: "center",
            alignItems: "center",
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
