import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Paper,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebaseConfig";
import { useParams, useNavigate, useLocation } from "react-router-dom";

const GenerateReport = () => {
  const { courseId } = useParams();
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const { courseName } = location.state || {};
  const navigate = useNavigate();

  const getLastestAttendedClass = (attendanceDates) => {
    try {
      const cleanedDates = attendanceDates.map(ts =>
        ts.replace("at ", "").replace(" EST", "")
      );
      const timestampNumbers = cleanedDates.map(ts => new Date(ts).getTime());
      const latestTimestamp = Math.max(...timestampNumbers);
      const lastClassAttendedDate = new Date(latestTimestamp);
      return lastClassAttendedDate
        ? lastClassAttendedDate.toLocaleString("en-US", { timeZone: "America/New_York" })
        : "N/A";
    } catch {
      console.error("Error getting the latest attended class");
      return "N/A";
    }
  };


  useEffect(() => {
    const fetchReportData = async () => {
      try {
        // Step 1: Get total classes for the course
        const courseRef = doc(collection(db, "courses"), courseId);
        const courseDoc = await getDoc(courseRef);
        const totalClasses = courseDoc.exists() ? courseDoc.data().totalClasses : 0;

        // Step 2: Get all attendance records for the course
        const attendanceQuery = query(
          collection(db, "attendanceSummaries"),
          where("courseId", "==", courseId)
        );
        const attendanceSnapshot = await getDocs(attendanceQuery);

        // Group attendance records by studentId
        const attendanceMap = {};
        attendanceSnapshot.docs.forEach((doc) => {
          const data = doc.data();
          const { studentId, timestamp } = data;

          if (!attendanceMap[studentId]) {
            attendanceMap[studentId] = { timestamps: [], totalClassAttended: 0 };
          }
          attendanceMap[studentId].timestamps.push(timestamp);
          attendanceMap[studentId].totalClassAttended += 1;
        });

        // Step 3: Fetch student details and calculate report data
        const reportPromises = Object.entries(attendanceMap).map(async ([studentId, attendanceData]) => {
          const studentRef = query(
            collection(db, "students"),
            where("studentId", "==", studentId)
          );
          const studentSnapshot = await getDocs(studentRef);

          if (!studentSnapshot.empty) {
            const studentData = studentSnapshot.docs[0].data();

            // Cap attended classes at totalClasses
            const cappedAttendedClasses = Math.min(attendanceData.totalClassAttended, totalClasses);

            // Calculate the last class attended
            const lastClassAttended = attendanceData.timestamps.length
              ? getLastestAttendedClass(attendanceData.timestamps)
              : "N/A";

            // Calculate attendance percentage
            const attendancePercentage = totalClasses > 0
              ? Math.round((cappedAttendedClasses / totalClasses) * 100)
              : 0;

            return {
              name: `${studentData.firstName} ${studentData.lastName}`,
              totalClassAttended: cappedAttendedClasses, // Use capped value
              lastClass: lastClassAttended,
              attendancePercentage,
            };
          }

          return null;
        });

        const fetchedReportData = await Promise.all(reportPromises);

        // Set the report data
        setReportData(fetchedReportData.filter((data) => data !== null));
      } catch (error) {
        console.error("Error fetching report data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, [courseId]);


  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: "80%", margin: "2rem auto", textAlign: "center" }}>
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
        <Typography variant="h4">
          Attendance Report for {courseName}
        </Typography>
      </Box>

      {/* Report Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Student Name</strong></TableCell>
              <TableCell align="center"><strong>Classes Attended</strong></TableCell>
              <TableCell align="center"><strong>Last Class Attended</strong></TableCell>
              <TableCell align="center"><strong>Attendance Percentage</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reportData.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.name}</TableCell>
                <TableCell align="center">{row.totalClassAttended}</TableCell>
                <TableCell align="center">{row.lastClass}</TableCell>
                <TableCell align="center">{row.attendancePercentage}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default GenerateReport;
