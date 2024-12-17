import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Box, Typography, Snackbar, Alert, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import QrScanner from "qr-scanner";
import { addDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../services/firebaseConfig";

const ScanQR = () => {
  const { courseId } = useParams();
  const location = useLocation();
  const { semesterId, semesterName, courseName } = location.state || {};
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const videoRef = useRef(null);
  const scannerRef = useRef(null);
  const navigate = useNavigate();

  const scannedSet = useRef(new Set()); // Tracks already scanned QR codes

  useEffect(() => {
    let videoElement;

    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });

        videoElement = videoRef.current;
        if (videoElement) {
          videoElement.srcObject = mediaStream;
          videoElement.onloadedmetadata = () => videoElement.play();
        }
      } catch (err) {
        setError("Unable to access camera. Please check your permissions.");
        console.error("Camera error:", err);
      }
    };

    startCamera();

    return () => {
      if (videoElement && videoElement.srcObject) {
        const tracks = videoElement.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      }
      if (scannerRef.current) {
        scannerRef.current.stop();
      }
    };
  }, []);

  const validateQRCode = async (qrData) => {
    try {
      const { studentId: scannedStudentId, courseId: scannedCourseId } = JSON.parse(qrData);

      // Prevent duplicate scans
      if (scannedSet.current.has(scannedStudentId)) {
        console.log("Duplicate QR code scan ignored.");
        return;
      }
      scannedSet.current.add(scannedStudentId);

      // Validate course ID matches the current courseId
      if (scannedCourseId !== courseId) {
        throw new Error("This QR code does not match the current course.");
      }

      // Query Firestore to check if student exists
      const studentsRef = collection(db, "students");
      const studentQuery = query(studentsRef, where("studentId", "==", scannedStudentId));
      const querySnapshot = await getDocs(studentQuery);

      if (querySnapshot.empty) {
        throw new Error("Student does not exist in the database.");
      }

      // Extract student document and data
      const studentDoc = querySnapshot.docs[0];
      const studentData = studentDoc.data();

      // Format timestamp
      const now = new Date();
      const formattedTimestamp = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
        timeZoneName: "short",
      }).format(now);

      // Mark attendance
      await addDoc(collection(db, "attendanceSummaries"), {
        studentId: scannedStudentId,
        courseId,
        email: studentData.email,
        timestamp: formattedTimestamp,
        status: true,
      });

      setSuccessMessage("Attendance marked successfully!");

      // Reload page after 1 second
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      console.error("QR Code Validation Error:", err.message);
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
        padding: "1rem",
        position: "relative",
      }}
    >
      {/* Header Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
          gap: "20px",
        }}
      >
        <IconButton
          onClick={() =>
            navigate(`/course-dashboard/${courseId}`, {
              state: { courseName, semesterName, semesterId },
            })
          }
          sx={{
            backgroundColor: "#cccccc",
            "&:hover": {
              backgroundColor: "#b3b3b3",
            },
          }}
        >
          <ArrowBackIcon />
        </IconButton>

        <Typography variant="h4">
          {courseName ? `Scan QR for ${courseName}` : "Scan QR"}
        </Typography>
      </Box>

      {/* Camera View */}
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
