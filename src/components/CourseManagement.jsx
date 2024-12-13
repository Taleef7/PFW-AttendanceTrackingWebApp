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
  AppBar,
  Toolbar,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../services/firebaseConfig";
import { useNavigate, useParams, useLocation } from "react-router-dom";

const CourseManagementPage = () => {
  const { semesterId } = useParams();
  const location = useLocation();
  const { semesterName } = location.state || {};
  const instructorId = localStorage.getItem("uid");
  const [courses, setCourses] = useState([]);
  const [courseForm, setCourseForm] = useState({
    ID: "",
    name: "",
    instructor: instructorId,
    semester: semesterId,
    students: [],
    totalClasses: 0,
  });
  const [courseToEdit, setCourseToEdit] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const fetchCourses = async () => {
    try {
      const coursesQuery = query(
        collection(db, "courses"),
        where("semester", "==", semesterId),
        where("instructor", "==", instructorId)
      );
      const coursesSnapshot = await getDocs(coursesQuery);
      const coursesList = coursesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCourses(coursesList);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [semesterId, instructorId]);

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
      console.error("Error saving course:", error);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    try {
      await deleteDoc(doc(db, "courses", courseId));
      alert("Course deleted successfully!");
      fetchCourses();
    } catch (error) {
      console.error("Error deleting course:", error);
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
        instructor: instructorId,
        semester: semesterId,
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

  const handleNavigateToCourse = (courseId, courseName, semesterId, semesterName) => {
    navigate(`/course-dashboard/${courseId}`, {
      state: { semesterId: semesterId, courseName: courseName, semesterName: semesterName },
    });
  };

  return (
    <Box
      sx={{
        maxWidth: "80%",
        margin: "2rem auto",
        textAlign: "center",
      }}
    >
      {/* Back Button */}
      <Box sx={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}>
        <IconButton
          edge="start"
          color="primary"
          onClick={() => navigate("/dashboard")}
          sx={{ marginRight: "1rem" }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5"></Typography>
      </Box>

      {/* Title */}
      <Typography variant="h4" sx={{ marginBottom: "2rem" }}>
        Courses for Semester {semesterName}
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
            onClick={() =>
              handleNavigateToCourse(course.id, course.name, semesterId, semesterName)
            }
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
                  <IconButton
                    color="primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShowForm(course);
                    }}
                    sx={{ marginRight: 1 }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={(e) => {
                      e.stopPropagation();
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
            onChange={(e) =>
              setCourseForm({ ...courseForm, ID: e.target.value })
            }
            sx={{ marginBottom: "1rem" }}
          />
          <TextField
            fullWidth
            label="Course Name"
            value={courseForm.name}
            onChange={(e) =>
              setCourseForm({ ...courseForm, name: e.target.value })
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
          <Button
            variant="outlined"
            color="secondary"
            fullWidth
            onClick={handleCloseForm}
          >
            Cancel
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default CourseManagementPage;
