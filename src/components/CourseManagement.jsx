import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  Modal,
  TextField,
  Alert,
  Divider,
  Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../services/firebaseConfig";
import { useNavigate } from "react-router-dom"; // For navigation

const CourseManagementPage = () => {
  const [courses, setCourses] = useState([]);
  const [courseForm, setCourseForm] = useState({
    ID: "",
    name: "",
    instructor: "/instructors/instructor1",
    semester: "/semesters/semester1",
    students: [],
    totalClasses: 0,
  });
  const [courseToEdit, setCourseToEdit] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate(); // Initialize navigation

  const fetchCourses = async () => {
    const coursesCollection = collection(db, "courses");
    const coursesSnapshot = await getDocs(coursesCollection);
    const coursesList = coursesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setCourses(coursesList);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const validateForm = (course) => {
    if (!course.ID.trim() || !course.name.trim()) {
      setError("Course Name and ID cannot be empty.");
      return false;
    }
    setError("");
    return true;
  };

  const handleAddOrUpdateCourse = async () => {
    if (!validateForm(courseForm)) return;

    try {
      if (courseToEdit) {
        const courseRef = doc(db, "courses", courseToEdit.id);
        await updateDoc(courseRef, courseForm);
        alert("Course updated successfully!");
      } else {
        await addDoc(collection(db, "courses"), courseForm);
        alert("Course added successfully!");
      }

      fetchCourses();
      handleCloseForm();
    } catch (error) {
      console.error("Error saving course: ", error);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    try {
      await deleteDoc(doc(db, "courses", courseId));
      alert("Course deleted successfully!");
      fetchCourses();
    } catch (error) {
      console.error("Error deleting course: ", error);
    }
  };

  const handleShowForm = (course = null) => {
    if (course) {
      setCourseForm(course);
      setCourseToEdit(course);
    } else {
      setCourseForm({
        ID: "",
        name: "",
        instructor: "/instructors/instructor1",
        semester: "/semesters/semester1",
        students: [],
        totalClasses: 0,
      });
      setCourseToEdit(null);
    }
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setError("");
    setShowForm(false);
    setCourseToEdit(null);
  };

  // Navigate to Course Dashboard
  const handleNavigateToCourse = (courseName) => {
    navigate(`/course-dashboard/${courseName}`);
  };

  return (
    <Box
      sx={{
        maxWidth: "80%",
        margin: "2rem auto",
        textAlign: "center",
      }}
    >
      <Typography variant="h4" sx={{ marginBottom: "2rem" }}>
        Course Management
      </Typography>

      {/* Courses List */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        {courses.map((course) => (
          <Card
            key={course.id}
            sx={{
              width: "100%",
              maxWidth: 600,
              padding: "1rem",
              boxShadow: 3,
              cursor: "pointer",
              transition: "transform 0.2s",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: 6,
              },
            }}
            onClick={() => handleNavigateToCourse(course.name)} // Navigate on card click
          >
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="h6">{course.name}</Typography>
                <Box>
                  {/* Edit Button */}
                  <IconButton
                    color="primary"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card click
                      handleShowForm(course);
                    }}
                    sx={{ marginRight: 1 }}
                  >
                    <EditIcon />
                  </IconButton>
                  {/* Delete Button */}
                  <IconButton
                    color="error"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card click
                      handleDeleteCourse(course.id);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
              <Divider sx={{ marginY: "1rem" }} />
              <Typography variant="body2" color="textSecondary">
                Course ID: {course.ID}
              </Typography>
            </CardContent>
          </Card>
        ))}

        {/* Add Course Button */}
        <IconButton
          color="primary"
          onClick={() => handleShowForm()}
          sx={{
            width: 56,
            height: 56,
            border: "2px solid #1976d2",
            borderRadius: "50%",
            marginTop: "1rem",
          }}
        >
          <AddIcon />
        </IconButton>
      </Box>

      {/* Form Modal */}
      <Modal
        open={showForm}
        onClose={handleCloseForm}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Box
          sx={{
            width: 400,
            backgroundColor: "white",
            padding: "2rem",
            borderRadius: "8px",
            boxShadow: 24,
          }}
        >
          <Typography variant="h6" gutterBottom>
            {courseToEdit ? "Edit Course" : "Add Course"}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ marginBottom: "1rem" }}>
              {error}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Course ID"
            value={courseForm.ID}
            onChange={(e) => setCourseForm({ ...courseForm, ID: e.target.value })}
            sx={{ marginBottom: "1rem" }}
          />
          <TextField
            fullWidth
            label="Course Name"
            value={courseForm.name}
            onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })}
            sx={{ marginBottom: "1rem" }}
          />
          <TextField
            fullWidth
            label="Instructor Reference"
            value={courseForm.instructor}
            onChange={(e) =>
              setCourseForm({ ...courseForm, instructor: e.target.value })
            }
            sx={{ marginBottom: "1rem" }}
          />
          <TextField
            fullWidth
            label="Semester Reference"
            value={courseForm.semester}
            onChange={(e) =>
              setCourseForm({ ...courseForm, semester: e.target.value })
            }
            sx={{ marginBottom: "1rem" }}
          />
          <TextField
            fullWidth
            label="Total Classes"
            type="number"
            value={courseForm.totalClasses}
            onChange={(e) =>
              setCourseForm({
                ...courseForm,
                totalClasses: parseInt(e.target.value, 10) || 0,
              })
            }
            sx={{ marginBottom: "1rem" }}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleAddOrUpdateCourse}
            sx={{ marginBottom: "1rem" }}
          >
            {courseToEdit ? "Update Course" : "Add Course"}
          </Button>
          <Button variant="outlined" color="secondary" fullWidth onClick={handleCloseForm}>
            Cancel
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default CourseManagementPage;
