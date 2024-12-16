import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  IconButton,
  Modal,
  TextField,
  Button,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { collection, doc, getDoc, updateDoc, arrayRemove } from "firebase/firestore";
import { db } from "../services/firebaseConfig";
import { useParams, useLocation, useNavigate } from "react-router-dom";

const StudentList = () => {
  const { courseId } = useParams();
  const location = useLocation();
  const { courseName } = location.state || {};
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const navigate = useNavigate();

  // Fetch students
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const courseRef = doc(collection(db, "courses"), courseId);
        const courseDoc = await getDoc(courseRef);

        if (courseDoc.exists()) {
          const courseData = courseDoc.data();
          const studentIds = courseData.students || [];

          const studentPromises = studentIds.map(async (studentId) => {
            const studentRef = doc(collection(db, "students"), studentId);
            const studentDoc = await getDoc(studentRef);
            return studentDoc.exists() ? { id: studentId, ...studentDoc.data() } : null;
          });

          const fetchedStudents = await Promise.all(studentPromises);

          // Sort students by name in ascending order
          const sortedStudents = fetchedStudents
            .filter((student) => student !== null)
            .sort((a, b) => a.firstName.localeCompare(b.firstName));
          setStudents(sortedStudents);
        } else {
          console.error("Course not found.");
        }
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [courseId]);

  const openEditModal = (student) => {
    setSelectedStudent(student);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setSelectedStudent(null);
    setIsEditModalOpen(false);
  };

  const handleUpdateStudent = async () => {
    if (!selectedStudent) return;

    try {
      const studentRef = doc(collection(db, "students"), selectedStudent.id);
      await updateDoc(studentRef, {
        firstName: selectedStudent.firstName,
        lastName: selectedStudent.lastName,
        email: selectedStudent.email,
      });

      // Update local state with the updated student details
      setStudents((prevStudents) =>
        prevStudents
          .map((student) =>
            student.id === selectedStudent.id ? { ...student, ...selectedStudent } : student
          )
          .sort((a, b) => a.firstName.localeCompare(b.firstName)) // Re-sort the list
      );

      alert("Student details updated successfully!");
      closeEditModal();
    } catch (error) {
      console.error("Error updating student:", error);
    }
  };

  const handleDeleteStudent = async (studentId) => {
    try {
      const courseRef = doc(collection(db, "courses"), courseId);

      // Remove student ID from the course's students array
      await updateDoc(courseRef, {
        students: arrayRemove(studentId),
      });

      // Update the local state
      setStudents((prevStudents) =>
        prevStudents.filter((student) => student.id !== studentId)
      );
      alert("Student removed from course successfully!");
    } catch (error) {
      console.error("Error removing student from course:", error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: "60%", margin: "2rem auto", textAlign: "center" }}>
      {/* Back Button */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          mb: 2,
          gap: "20px"
        }}
        onClick={() => navigate(-1)} // Navigate back to the previous page
      >
        <IconButton
          sx={{
            backgroundColor: "#cccccc",
            "&:hover": {
              backgroundColor: "#b3b3b3",
            },
          }}>
          <ArrowBackIcon sx={{ fontSize: 28 }} />
        </IconButton>
      {/* Page Header */}
      <Typography variant="h4">
        Student List for Course {courseName}
      </Typography>
      </Box>



      {students.length > 0 ? (
        <Card
          sx={{
            padding: "1rem",
            boxShadow: 3,
          }}
        >
          <CardContent>
            <List>
              {students.map((student) => (
                <ListItem key={student.id} sx={{ borderBottom: "1px solid #ddd" }}>
                  <ListItemText
                    primary={`${student.firstName} ${student.lastName}`}
                    secondary={`Email: ${student.email}`}
                  />
                  <IconButton color="primary" onClick={() => openEditModal(student)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDeleteStudent(student.id)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      ) : (
        <Typography>No students found for this course.</Typography>
      )}

      {/* Edit Modal */}
      <Modal
        open={isEditModalOpen}
        onClose={closeEditModal}
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
            Edit Student Details
          </Typography>
          {selectedStudent && (
            <>
              <TextField
                fullWidth
                label="First Name"
                variant="outlined"
                sx={{ marginBottom: "1rem" }}
                value={selectedStudent.firstName}
                onChange={(e) =>
                  setSelectedStudent((prev) => ({ ...prev, firstName: e.target.value }))
                }
              />
              <TextField
                fullWidth
                label="Last Name"
                variant="outlined"
                sx={{ marginBottom: "1rem" }}
                value={selectedStudent.lastName}
                onChange={(e) =>
                  setSelectedStudent((prev) => ({ ...prev, lastName: e.target.value }))
                }
              />
              <TextField
                fullWidth
                label="Email"
                type="email"
                variant="outlined"
                sx={{ marginBottom: "1rem" }}
                value={selectedStudent.email}
                onChange={(e) =>
                  setSelectedStudent((prev) => ({ ...prev, email: e.target.value }))
                }
              />
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ marginBottom: "1rem" }}
                onClick={handleUpdateStudent}
              >
                Save Changes
              </Button>
              <Button variant="outlined" color="secondary" fullWidth onClick={closeEditModal}>
                Cancel
              </Button>
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default StudentList;
