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
import { useParams, useNavigate } from "react-router-dom";

const GenerateReport = () => {
  const { courseId } = useParams();
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const attendanceQuery = query(
          collection(db, "attendanceSummaries"),
          where("courseId", "==", courseId)
        );

        const attendanceSnapshot = await getDocs(attendanceQuery);

        const reportPromises = attendanceSnapshot.docs.map(async (doc) => {
          const attendanceData = doc.data();
          const studentRef = doc(collection(db, "students"), attendanceData.studentID);
          const studentDoc = await getDoc(studentRef);

          if (studentDoc.exists()) {
            const studentData = studentDoc.data();

            // Fetch total classes from courses collection
            const courseRef = doc(collection(db, "courses"), courseId);
            const courseDoc = await getDoc(courseRef);
            const totalClasses = courseDoc.exists() ? courseDoc.data().totalClasses : 0;

            const attendancePercentage = Math.round(
              (attendanceData.totalClassAttended / totalClasses) * 100
            );

            return {
              name: `${studentData.firstName} ${studentData.lastName}`,
              totalClassAttended: attendanceData.totalClassAttended,
              lastClass: attendanceData.lastClass || "N/A",
              attendancePercentage: attendancePercentage || 0,
            };
          }

          return null;
        });

        const fetchedReportData = await Promise.all(reportPromises);

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
      {/* Back Button */}
      <Box sx={{ textAlign: "left", marginBottom: "0.5rem" }}>
        <IconButton
          onClick={() => navigate(-1)} // Navigate back to the previous page
          sx={{
            color: "#000", // Black color for the button
            fontSize: "1.2rem",
          }}
        >
          <ArrowBackIcon /> {/* Back arrow icon */}
        </IconButton>
      </Box>

      {/* Header */}
      <Typography variant="h4" sx={{ marginBottom: "2rem" }}>
        Attendance Report for Course {courseId}
      </Typography>

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
