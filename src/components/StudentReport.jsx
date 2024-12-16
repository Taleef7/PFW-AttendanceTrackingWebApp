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
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);

  const getLastestAttendedClass = (attendanceDates) => {
    try {
      const cleanedDates = attendanceDates.map(ts => 
        ts.replace('at ', '').replace(' EST', '')
      );
      const timestampNumbers = cleanedDates.map(ts => new Date(ts).getTime());
      const latestTimestamp = Math.max(...timestampNumbers);
      const lastClassAttendedDate = new Date(latestTimestamp);
      const lastClassAttended = lastClassAttendedDate
      ? lastClassAttendedDate.toLocaleString("en-US", { timeZone: "America/New_York" }) // Adjust time zone as needed
      : "N/A";
      return lastClassAttended;
    } catch {
      console.log("error getting latest attended class");
    }
  }

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

  const handleSearch = async () => {
    if (!selectedStudent) return;
    setLoading(true);
    try {
      const attendanceRef = query(
        collection(db, "attendanceSummaries"),
        where("studentId", "==", selectedStudent),
        where("courseId", "==", courseId)
      );
      const attendanceSnapshot = await getDocs(attendanceRef);

      if (!attendanceSnapshot.empty) {
        const attendedClasses = attendanceSnapshot.size;

        const attendanceDates = attendanceSnapshot.docs.map(doc => doc.data().timestamp);
        const lastClassAttended = getLastestAttendedClass(attendanceDates);
        
        const totalClassesRef = doc(collection(db, "courses"), courseId);
        const courseDoc = await getDoc(totalClassesRef);
        const totalClasses = courseDoc.exists() ? courseDoc.data().totalClasses : 0;

        const studentRef = query(
          collection(db, "students"),
          where("studentId", "==", selectedStudent)
        );
        
        const studentSnapshot = await getDocs(studentRef);
        
        let firstName= "";
        let lastName = "";
        if (!studentSnapshot.empty) {
          const studentData = studentSnapshot.docs[0].data();
          firstName = studentData?.firstName || "Unknown";
          lastName = studentData?.lastName || "Unknown"
        } 
        
        const attendancePercentage = totalClasses > 0 ?
          Math.round((attendedClasses / totalClasses) * 100) :
          0;

        setReportData({
          name: `${firstName} ${lastName}`,
          attendedClasses,
          totalClasses,
          lastClassAttended: lastClassAttended,
            attendancePercentage: attendancePercentage || 0,
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
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
          gap: "20px"
        }}
      >
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
        <Typography variant="h4" sx={{ textAlign: "center" }}>
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
            <MenuItem key={student.studentId} value={student.studentId}>
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
