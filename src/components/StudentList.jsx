// src/pages/StudentList.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Alert,
} from "@mui/material";
import { fetchStudentsInCourse } from "../services/studentService";

const StudentList = () => {
  const { courseId, semesterId } = useParams(); // Get courseId and semesterId from URL
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!courseId || !semesterId) {
      setError("Invalid course or semester details.");
      setLoading(false);
      return;
    }

    const fetchStudents = async () => {
      try {
        setLoading(true);
        const fetchedStudents = await fetchStudentsInCourse(courseId); // Ensure this fetches correctly by courseId
        setStudents(fetchedStudents);
      } catch (err) {
        console.error("Error fetching students:", err);
        setError("Failed to fetch students. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [courseId, semesterId]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: "center", padding: "2rem" }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: "80%", margin: "2rem auto" }}>
      <Typography variant="h4" sx={{ marginBottom: "1rem" }}>
        Students for Course {courseId} - Semester {semesterId}
      </Typography>

      {students.length === 0 ? (
        <Typography>No students found for this course.</Typography>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Student ID</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id}>
                <TableCell>{`${student.firstName} ${student.lastName}`}</TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>{student.studentId}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Box>
  );
};

export default StudentList;
