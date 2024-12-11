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
} from "@mui/material";
import { getFirestore, collection, query, where, getDocs, addDoc, doc, updateDoc, arrayUnion } from "firebase/firestore";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import SendIcon from "@mui/icons-material/Send";
import ListAltIcon from "@mui/icons-material/ListAlt";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import BarChartIcon from "@mui/icons-material/BarChart";
import DescriptionIcon from "@mui/icons-material/Description";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import { db } from "../services/firebaseConfig"; // Import your Firebase initialization

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
  const [courseData, setCourseData] = useState(null); // Dynamic course data
  const [notificationOpen, setNotificationOpen] = useState(false); // Snackbar state
  const [notificationMessage, setNotificationMessage] = useState(""); // Message for notification
  const [notificationSeverity, setNotificationSeverity] = useState("success"); // Success or error severity
  const [formSubmitted, setFormSubmitted] = useState(false); // New state to track if the form is submitted
  const navigate = useNavigate();

  useEffect(() => {
    const resolvedName = courseId || `Semester-${semesterName}`; // Resolve missing name or ID
    const fetchCourseData = async () => {
      const fetchedData = {
        name: resolvedName,
        actions: [
          {
            label: "Scan QR",
            icon: <QrCodeScannerIcon />,
            path: `/scan-qr/${courseId || semesterId}`, // Dynamically resolve name or ID
          },
          {
            label: "Send QR Codes",
            icon: <SendIcon />,
            onClick: handleQrCodeSent, // Trigger QR code sent notification
          },
          { label: "Student List", icon: <ListAltIcon />, path: `/student-list/${semesterId}` },
          { label: "Import Class List", icon: <FileDownloadIcon />, path: `/import-class/${semesterId}` },
          { label: "Analytics Screen", icon: <BarChartIcon />, path: `/analytics/${semesterId}` },
          { label: "Generate Student Report", icon: <DescriptionIcon />, path: `/generate-report/${semesterId}` },
          { label: "Individual Student Report", icon: <DescriptionIcon />, path: `/student-report/${semesterId}` },
          { label: "Add Student", icon: <NoteAddIcon />, onClick: () => setIsAddStudentOpen(true) },
        ],
      };
      setCourseData(fetchedData);
    };

    fetchCourseData();
  }, [courseId, semesterId]);

  const openAddStudentModal = () => setIsAddStudentOpen(true);
  const closeAddStudentModal = () => {
    setIsAddStudentOpen(false);
    setFormSubmitted(false); // Reset the form submitted state when closing
    setNewStudent({ firstName: "", lastName: "", studentId: "", email: "" });
  };

  const handleAddStudent = async (courseId) => {  
    // Validate only after form is submitted
    setFormSubmitted(true);

    // Check if fields are empty
    if (!newStudent.firstName || !newStudent.lastName || !newStudent.studentId || !newStudent.email) {
      alert("Please fill in all fields. None of the fields can be empty.");
      return; // Exit the function if validation fails
    }

    try {
      // 1. Check if student exists in the student table by studentId
      const studentRef = collection(db, "students");
      const q = query(studentRef, where("studentId", "==", newStudent.studentId));
      const studentSnapshot = await getDocs(q);
  
      let studentDoc;
      if (!studentSnapshot.empty) {
        // Student exists
        studentDoc = studentSnapshot.docs[0]; // Get the student document
        console.log("Student found:", studentDoc.data());
      } else {
        // Student does not exist, create a new student document
        studentDoc = await addDoc(studentRef, {
          firstName: newStudent.firstName,
          lastName: newStudent.lastName,
          studentId: newStudent.studentId,
          email: newStudent.email,
        });
        console.log("New student added:", studentDoc.id);
      }
  
      // 2. Now add the student to the specific course's student array
      const courseRef = doc(db, "courses", courseId); // Ensure you're referencing the correct course document
      await updateDoc(courseRef, {
        students: arrayUnion(studentDoc.id), // Adding student ID to the course's students array
      });
  
      console.log("Student added to course:", courseId);

      // Show success notification for student addition
      setNotificationOpen(true);
      setNotificationMessage("Student added successfully!");
      setNotificationSeverity("success");

      // Reset the form fields
      setNewStudent({ firstName: "", lastName: "", studentId: "", email: "" });

      // Close the modal
      closeAddStudentModal();
    } catch (error) {
      console.error("Error adding student to course:", error);
      // Show error notification for student addition
      setNotificationOpen(true);
      setNotificationMessage("Error adding student to course.");
      setNotificationSeverity("error");
    }
  };

  // Handle QR Code sent alert
  const handleQrCodeSent = () => {
    setNotificationOpen(true);
    setNotificationMessage("QR Codes Sent Successfully!");
    setNotificationSeverity("success");
  };

  const handleActionClick = (path) => {
    if (path) navigate(path);
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
      {/* Header */}
      <Typography variant="h4" component="h1" sx={{ marginBottom: "1.5rem" }}>
        {semesterName} - {courseName || "Course Dashboard"}
      </Typography>

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
              onClick={() => (action.onClick ? action.onClick() : handleActionClick(action.path))}
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
            onChange={(e) =>
              setNewStudent((prev) => ({ ...prev, firstName: e.target.value }))
            }
            required
          />
          <TextField
            fullWidth
            label="Last Name"
            variant="outlined"
            sx={{ marginBottom: "1rem" }}
            value={newStudent.lastName}
            onChange={(e) =>
              setNewStudent((prev) => ({ ...prev, lastName: e.target.value }))
            }
            required
          />
          <TextField
            fullWidth
            label="Student ID"
            variant="outlined"
            sx={{ marginBottom: "1rem" }}
            value={newStudent.studentId}
            onChange={(e) =>
              setNewStudent((prev) => ({ ...prev, studentId: e.target.value }))
            }
            required
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            variant="outlined"
            sx={{ marginBottom: "1rem" }}
            value={newStudent.email}
            onChange={(e) =>
              setNewStudent((prev) => ({ ...prev, email: e.target.value }))
            }
            required
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginBottom: "1rem" }}
            onClick={() => handleAddStudent(courseId)} // Passing courseId as parameter
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
          severity={notificationSeverity}  // Success or error severity
          sx={{ width: "100%" }}
        >
          {notificationMessage}  {/* Dynamic message content */}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CourseDashboard;
