import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  MenuItem,
  TextField,
  Button,
  Card,
  CardContent,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { collection, doc, getDoc, query, where, getDocs } from "firebase/firestore";
import { db } from "../services/firebaseConfig";
import { useParams, useNavigate } from "react-router-dom";

const StudentReport = () => {
  const { courseId } = useParams(); // Retrieve courseId from URL params
  const navigate = useNavigate(); // Navigation hook
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch students for the dropdown
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const courseRef = doc(collection(db, "courses"), courseId);
        const courseDoc = await getDoc(courseRef);

        if (courseDoc.exists()) {
          const courseData = courseDoc.data();
          const studentIds = courseData.students || [];

          // Fetch student details
          const studentPromises = studentIds.map(async (studentId) => {
            const studentRef = doc(collection(db, "students"), studentId);
            const studentDoc = await getDoc(studentRef);
            return studentDoc.exists()
              ? { id: studentId, ...studentDoc.data() }
              : null;
          });

          const fetchedStudents = await Promise.all(studentPromises);
          setStudents(fetchedStudents.filter((student) => student !== null));
        } else {
          console.error("Course not found.");
        }
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, [courseId]);

  // Fetch report data when a student is selected and "Search" is clicked
  const handleSearch = async () => {
    if (!selectedStudent) return;

    setLoading(true);
    try {
      const attendanceRef = query(
        collection(db, "attendanceSummaries"),
        where("studentID", "==", selectedStudent),
        where("courseId", "==", courseId)
      );
      const attendanceSnapshot = await getDocs(attendanceRef);

      if (!attendanceSnapshot.empty) {
        const attendanceData = attendanceSnapshot.docs[0].data();
        const totalClassesRef = doc(collection(db, "courses"), courseId);
        const courseDoc = await getDoc(totalClassesRef);

        const totalClasses = courseDoc.exists() ? courseDoc.data().totalClasses : 0;
        const attendedClasses = attendanceData.dates.length;

        const percentage = Math.round((attendedClasses / totalClasses) * 100);

        setReportData({
          name: `${attendanceData.firstName} ${attendanceData.lastName}`,
          attendedClasses,
          totalClasses,
          lastClassAttended: attendanceData.lastClass || "N/A",
          attendancePercentage: percentage || 0,
        });
      } else {
        setReportData(null);
      }
    } catch (error) {
      console.error("Error fetching report data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: "80%", margin: "2rem auto" }}>
      {/* Back Button */}
      <Box sx={{ textAlign: "left", marginBottom: "1rem" }}>
        <IconButton
          onClick={() => navigate(-1)}
          sx={{
            backgroundColor: "#cccccc",
            "&:hover": {
              backgroundColor: "#b3b3b3",
            },
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" sx={{ textAlign: "center", marginBottom: "2rem" }}>
        Student Report
      </Typography>
      </Box>

      {/* Dropdown and Search Button */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        <TextField
          select
          label="Select Student"
          value={selectedStudent}
          onChange={(e) => setSelectedStudent(e.target.value)}
          sx={{ width: "300px" }}
        >
          {students.map((student) => (
            <MenuItem key={student.id} value={student.id}>
              {student.firstName} {student.lastName}
            </MenuItem>
          ))}
        </TextField>

        <Button
          variant="contained"
          color="primary"
          onClick={handleSearch}
          disabled={!selectedStudent}
        >
          Search
        </Button>
      </Box>

      {/* Report output */}
      {loading ? (
        <Typography>Loading...</Typography>
      ) : reportData ? (
        <Card sx={{ padding: "2rem", boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ marginBottom: "1rem" }}>
              Report for {reportData.name}
            </Typography>
            <Typography>
              Classes Attended: {reportData.attendedClasses}/{reportData.totalClasses}
            </Typography>
            <Typography>
              Last Class Attended: {reportData.lastClassAttended}
            </Typography>
            <Typography>
              Attendance Percentage: {reportData.attendancePercentage}%
            </Typography>
          </CardContent>
        </Card>
      ) : (
        selectedStudent && (
          <Typography>No attendance data found for this student.</Typography>
        )
      )}
    </Box>
  );
};

export default StudentReport;
