import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Modal,
  TextField,
  Button,
  Snackbar,
  Alert,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  arrayUnion,
  getDoc,
} from "firebase/firestore";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import SendIcon from "@mui/icons-material/Send";
import ListAltIcon from "@mui/icons-material/ListAlt";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import BarChartIcon from "@mui/icons-material/BarChart";
import DescriptionIcon from "@mui/icons-material/Description";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import { db } from "../services/firebaseConfig";
import { generateQRCodeForStudent } from "../utils/qrCodeUtils";

const CourseDashboard = () => {
  const { courseId } = useParams();
  const location = useLocation();
  const { semesterId, semesterName, courseName } = location.state || {};
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({
    firstName: "",
    lastName: "",
    studentId: "",
    email: "",
  });
  const [courseData, setCourseData] = useState(null);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationSeverity, setNotificationSeverity] = useState("success");
  const navigate = useNavigate();

  useEffect(() => {
    const resolvedName = courseId || `Semester-${semesterName}`;
    const fetchCourseData = async () => {
      const fetchedData = {
        name: resolvedName,
        actions: [
          {
            label: "Scan QR",
            icon: <QrCodeScannerIcon />,
            path: `/scan-qr/${courseId || semesterId}`,
          },
          {
            label: "Send QR Codes",
            icon: <SendIcon />,
            onClick: handleQrCodeSent,
          },
          { label: "Student List", icon: <ListAltIcon />, path: `/student-list/${courseId}` },
          { label: "Import Class List", icon: <FileDownloadIcon />, path: `/import-class/${courseId}` },
          { label: "Analytics Screen", icon: <BarChartIcon />, path: `/analytics/${courseId}` },
          { label: "Generate Student Report", icon: <DescriptionIcon />, path: `/generate-report/${courseId}` },
          { label: "Individual Student Report", icon: <DescriptionIcon />, path: `/student-report/${courseId}` },
          { label: "Add Student", icon: <NoteAddIcon />, onClick: () => setIsAddStudentOpen(true) },
        ],
      };
      setCourseData(fetchedData);
    };

    fetchCourseData();
  }, [courseId, semesterId, semesterName]);

  const closeAddStudentModal = () => {
    setIsAddStudentOpen(false);
    setNewStudent({ firstName: "", lastName: "", studentId: "", email: "" });
  };

  const handleAddStudent = async (courseId) => {
    if (!newStudent.firstName || !newStudent.lastName || !newStudent.studentId || !newStudent.email) {
      alert("Please fill in all fields. None of the fields can be empty.");
      return;
    }

    try {
      const studentRef = collection(db, "students");
      const q = query(studentRef, where("email", "==", newStudent.email));
      const studentSnapshot = await getDocs(q);

      let studentDocId;
      if (!studentSnapshot.empty) {
        const studentDoc = studentSnapshot.docs[0];
        studentDocId = studentDoc.id;
      } else {
        const qrCode = await generateQRCodeForStudent(
          {
            id: newStudent.studentId,
            email: newStudent.email,
          },
          courseId
        );

        const studentDoc = await addDoc(studentRef, {
          firstName: newStudent.firstName,
          lastName: newStudent.lastName,
          studentId: newStudent.studentId,
          email: newStudent.email,
          qrCode,
        });
        studentDocId = studentDoc.id;
      }

      const courseRef = doc(db, "courses", courseId);
      const courseDoc = await getDoc(courseRef);
      const courseData = courseDoc.data();
      const students = courseData?.students || [];

      if (!students.includes(studentDocId)) {
        await updateDoc(courseRef, {
          students: arrayUnion(studentDocId),
        });
        setNotificationMessage("Student added successfully!");
        setNotificationSeverity("success");
      } else {
        setNotificationMessage("Student is already enrolled in this course.");
        setNotificationSeverity("info");
      }

      setNotificationOpen(true);
      setNewStudent({ firstName: "", lastName: "", studentId: "", email: "" });
      closeAddStudentModal();
    } catch (error) {
      setNotificationOpen(true);
      setNotificationMessage("Error adding student to course.");
      setNotificationSeverity("error");
    }
  };

  const handleQrCodeSent = () => {
    setNotificationOpen(true);
    setNotificationMessage("QR Codes Sent Successfully!");
    setNotificationSeverity("success");
  };

  const handleActionClick = (path) => {
    navigate(path);
  };

  const handleCloseNotification = () => {
    setNotificationOpen(false);
  };

  if (!courseData) return <Typography>Loading...</Typography>;

  return (
    <Box
      sx={{
        maxWidth: "80%",
        margin: "2rem auto",
        textAlign: "center",
        padding: "1rem",
      }}
    >
      {/* Header with Back Button */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
        }}
      >
        <IconButton
          onClick={() => navigate(-1)}
          sx={{
            backgroundColor: "#f5f5f5",
            "&:hover": {
              backgroundColor: "#e0e0e0",
            },
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4">
          {semesterName} - {courseName || "Course Dashboard"}
        </Typography>
        <Box sx={{ width: "48px" }} /> {/* Spacer to balance the layout */}
      </Box>

      {/* Action Grid */}
      <Grid container spacing={3}>
        {courseData.actions.map((action, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <Card
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "1rem",
                boxShadow: 3,
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 6,
                  cursor: "pointer",
                },
              }}
              onClick={() =>
                action.onClick ? action.onClick() : handleActionClick(action.path)
              }
            >
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    fontSize: "2rem",
                    color: "#673ab7",
                    marginBottom: "0.5rem",
                  }}
                >
                  {action.icon}
                </Box>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {action.label}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Add Student Modal */}
      <Modal
        open={isAddStudentOpen}
        onClose={closeAddStudentModal}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            backgroundColor: "#fff",
            padding: "2rem",
            borderRadius: "8px",
            width: "400px",
            boxShadow: 24,
          }}
        >
          <Typography variant="h6" sx={{ marginBottom: "1rem" }}>
            Add Student
          </Typography>
          <TextField
            fullWidth
            label="First Name"
            variant="outlined"
            sx={{ marginBottom: "1rem" }}
            value={newStudent.firstName}
            onChange={(e) => setNewStudent((prev) => ({ ...prev, firstName: e.target.value }))}
            required
          />
          <TextField
            fullWidth
            label="Last Name"
            variant="outlined"
            sx={{ marginBottom: "1rem" }}
            value={newStudent.lastName}
            onChange={(e) => setNewStudent((prev) => ({ ...prev, lastName: e.target.value }))}
            required
          />
          <TextField
            fullWidth
            label="Student ID"
            variant="outlined"
            sx={{ marginBottom: "1rem" }}
            value={newStudent.studentId}
            onChange={(e) => setNewStudent((prev) => ({ ...prev, studentId: e.target.value }))}
            required
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            variant="outlined"
            sx={{ marginBottom: "1rem" }}
            value={newStudent.email}
            onChange={(e) => setNewStudent((prev) => ({ ...prev, email: e.target.value }))}
            required
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginBottom: "1rem" }}
            onClick={() => handleAddStudent(courseId)}
          >
            Add Student
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            fullWidth
            onClick={closeAddStudentModal}
          >
            Cancel
          </Button>
        </Box>
      </Modal>

      {/* Notification */}
      <Snackbar
        open={notificationOpen}
        autoHideDuration={3000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notificationSeverity}
          sx={{ width: "100%" }}
        >
          {notificationMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CourseDashboard;
