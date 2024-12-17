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
import { sendQRCodesToStudents } from "../services/emailService";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import SendIcon from "@mui/icons-material/Send";
import ListAltIcon from "@mui/icons-material/ListAlt";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import BarChartIcon from "@mui/icons-material/BarChart";
import DescriptionIcon from "@mui/icons-material/Description";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import { db } from "../services/firebaseConfig";
import { generateQRCodeForStudent } from "../utils/qrCodeUtils";
import * as XLSX from "xlsx";

const CourseDashboard = () => {
  const { courseId } = useParams();
  const location = useLocation();
  const { semesterId, semesterName, courseName } = location.state || {};
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({
    firstName: "",
    lastName: "",
    studentId: "",
    email: "",
  });
  const [importFile, setImportFile] = useState(null);
  const [courseData, setCourseData] = useState(null);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationSeverity, setNotificationSeverity] = useState("success");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourseData = async () => {
      const fetchedData = {
        name: courseId,
        actions: [
          {
            label: "Scan QR",
            icon: <QrCodeScannerIcon />,
            path: `/scan-qr/${courseId}`,
            state: { courseName, semesterName, semesterId },
          },
          {
            label: "Send QR Codes",
            icon: <SendIcon />,
            onClick: handleQrCodeSent,
          },
          { label: "Student List", icon: <ListAltIcon />, path: `/student-list/${courseId}` },
          {
            label: "Import Class List",
            icon: <FileDownloadIcon />,
            onClick: () => setIsImportOpen(true),
          },
          { label: "Analytics Screen", icon: <BarChartIcon />, path: `/analytics/${courseId}` },
          { label: "Generate Class Report", icon: <DescriptionIcon />, path: `/generate-report/${courseId}`, state: { courseName },},
          { label: "Individual Student Report", icon: <DescriptionIcon />, path: `/student-report/${courseId}` },
          { label: "Add Student", icon: <NoteAddIcon />, onClick: () => setIsAddStudentOpen(true) },
        ],
      };
      setCourseData(fetchedData);
    };

    fetchCourseData();
  }, [courseId, semesterId, semesterName, courseName]);

  const closeAddStudentModal = () => {
    setIsAddStudentOpen(false);
    setNewStudent({ firstName: "", lastName: "", studentId: "", email: "" });
  };

  const closeImportModal = () => {
    setIsImportOpen(false);
    setImportFile(null);
  };

  const handleAddStudent = async (student) => {
    const { firstName, lastName, studentId, email } = student;

    if (!firstName || !lastName || !studentId || !email) {
      setNotificationMessage("Please fill in all fields.");
      setNotificationSeverity("error");
      setNotificationOpen(true);
      return;
    }

    try {
      const studentRef = collection(db, "students");
      const q = query(studentRef, where("email", "==", email));
      const studentSnapshot = await getDocs(q);

      let studentDocId;
      if (!studentSnapshot.empty) {
        const studentDoc = studentSnapshot.docs[0];
        studentDocId = studentDoc.id;
      } else {
        const qrCode = await generateQRCodeForStudent(
          {
            id: studentId,
            email: email,
          },
          courseId
        );

        const studentDoc = await addDoc(studentRef, {
          firstName: firstName,
          lastName: lastName,
          studentId: studentId,
          email: email,
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
      closeAddStudentModal();
    } catch (error) {
      setNotificationMessage("Error adding student to course.");
      setNotificationSeverity("error");
      setNotificationOpen(true);
    }
  };

  const handleImportStudents = async () => {
    if (!importFile) {
      setNotificationMessage("Please select a file to import.");
      setNotificationSeverity("error");
      setNotificationOpen(true);
      return;
    }

    try {
      const fileReader = new FileReader();
      fileReader.onload = async (event) => {
        const data = event.target.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const students = XLSX.utils.sheet_to_json(sheet);

        const results = await Promise.all(
          students.map(async (student) => {
            const { firstName, lastName, email, studentId } = student;
            if (firstName && lastName && email && studentId) {
              try {
                await handleAddStudent({ firstName, lastName, studentId, email });
                return { success: true };
              } catch (error) {
                return { success: false, message: error.message };
              }
            } else {
              return { success: false, message: "Missing required fields in the file." };
            }
          })
        );

        const successCount = results.filter((res) => res.success).length;
        const failureCount = results.length - successCount;

        setNotificationMessage(
          `Import complete. ${successCount} students added successfully. ${failureCount} failed.`
        );
        setNotificationSeverity("success");
        setNotificationOpen(true);
        closeImportModal();
      };

      fileReader.readAsBinaryString(importFile);
    } catch (error) {
      setNotificationMessage("Error importing students.");
      setNotificationSeverity("error");
      setNotificationOpen(true);
    }
  };

  const handleFileChange = (event) => {
    setImportFile(event.target.files[0]);
  };


  const handleQrCodeSent = async () => {
    setNotificationOpen(false);
    setNotificationMessage("");
    setNotificationSeverity("success");
    console.log("Sending QR codes for courseId:", courseId); // Debugging line
    try {
      // Call the email service with courseId
      setNotificationMessage("Sending QR codes, please wait...");
      setNotificationSeverity("info");
      setNotificationOpen(true);

      const result = await sendQRCodesToStudents(courseId);
      setNotificationMessage(`Success: ${result.message}`);
      setNotificationSeverity("success");
    } catch (error) {
      console.error("Error sending QR codes:", error);
      setNotificationMessage("Failed to send QR codes. Please try again.");
      setNotificationSeverity("error");
    } finally {
      setNotificationOpen(true);
    }
  };


  const handleActionClick = (path, state = {}) => {
    navigate(path, { state });
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
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
        }}
      >
        <IconButton
          onClick={() =>
            navigate(`/course-management/${semesterId}`, {
              state: { semesterName },
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
          {semesterName} - {courseName || "Course Dashboard"}
        </Typography>
        <Box sx={{ width: "48px" }} />
      </Box>

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
                action.onClick
                  ? action.onClick()
                  : handleActionClick(action.path, action.state)
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
            onClick={() => handleAddStudent(newStudent)}
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

      <Modal
        open={isImportOpen}
        onClose={closeImportModal}
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
            Import Students
          </Typography>
          <Button
            variant="outlined"
            component="label"
            sx={{ marginBottom: "1rem" }}
          >
            Upload File
            <input
              type="file"
              hidden
              accept=".csv, .xlsx"
              onChange={handleFileChange}
            />
          </Button>
          {importFile && <Typography>{importFile.name}</Typography>}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginBottom: "1rem" }}
            onClick={handleImportStudents}
          >
            Import
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            fullWidth
            onClick={closeImportModal}
          >
            Cancel
          </Button>
        </Box>
      </Modal>

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
