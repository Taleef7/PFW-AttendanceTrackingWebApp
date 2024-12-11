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
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import SendIcon from "@mui/icons-material/Send";
import ListAltIcon from "@mui/icons-material/ListAlt";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import BarChartIcon from "@mui/icons-material/BarChart";
import DescriptionIcon from "@mui/icons-material/Description";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import { useParams, useNavigate, useLocation } from "react-router-dom";

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
            onClick: () => setNotificationOpen(true), // Trigger notification
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
    setNewStudent({ firstName: "", lastName: "", studentId: "", email: "" });
  };

  const handleAddStudent = () => {
    console.log("New Student Data:", newStudent);
    closeAddStudentModal();
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
            onClick={handleAddStudent}
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
          severity="success"
          sx={{ width: "100%" }}
        >
          QR Codes Sent Successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CourseDashboard;
