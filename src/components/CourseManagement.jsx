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
  Button, // Add this line
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../services/firebaseConfig";

const CourseManagementPage = () => {
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState({
    ID: "",
    name: "",
    instructor: "/instructors/instructor1",
    semester: "/semesters/semester1",
    students: [],
    totalClasses: 0,
  });
  const [courseToUpdate, setCourseToUpdate] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

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

  const handleAddCourse = async () => {
    if (!validateForm(newCourse)) return;

    try {
      await addDoc(collection(db, "courses"), newCourse);
      alert("Course added successfully!");
      fetchCourses();
      setNewCourse({ ID: "", name: "", instructor: "", semester: "", students: [], totalClasses: 0 });
      setShowForm(false);
    } catch (error) {
      console.error("Error adding course: ", error);
    }
  };

  const handleUpdateCourse = async () => {
    if (!validateForm(courseToUpdate)) return;

    try {
      const courseRef = doc(db, "courses", courseToUpdate.id);
      await updateDoc(courseRef, courseToUpdate);
      alert("Course updated successfully!");
      fetchCourses();
      setCourseToUpdate(null);
      setShowForm(false);
    } catch (error) {
      console.error("Error updating course: ", error);
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
    if (course) setCourseToUpdate(course);
    else setCourseToUpdate(null);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setError("");
    setShowForm(false);
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
            }}
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
                    onClick={() => handleShowForm(course)}
                    sx={{ marginRight: 1 }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteCourse(course.id)}
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

        {/* Add Course Button as Icon */}
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
            {courseToUpdate ? "Update Course" : "Add Course"}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ marginBottom: "1rem" }}>
              {error}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Course ID"
            value={courseToUpdate ? courseToUpdate.ID : newCourse.ID}
            onChange={(e) =>
              courseToUpdate
                ? setCourseToUpdate({ ...courseToUpdate, ID: e.target.value })
                : setNewCourse({ ...newCourse, ID: e.target.value })
            }
            sx={{ marginBottom: "1rem" }}
          />
          <TextField
            fullWidth
            label="Course Name"
            value={courseToUpdate ? courseToUpdate.name : newCourse.name}
            onChange={(e) =>
              courseToUpdate
                ? setCourseToUpdate({ ...courseToUpdate, name: e.target.value })
                : setNewCourse({ ...newCourse, name: e.target.value })
            }
            sx={{ marginBottom: "1rem" }}
          />
          <TextField
            fullWidth
            label="Instructor Reference"
            value={courseToUpdate ? courseToUpdate.instructor : newCourse.instructor}
            onChange={(e) =>
              courseToUpdate
                ? setCourseToUpdate({ ...courseToUpdate, instructor: e.target.value })
                : setNewCourse({ ...newCourse, instructor: e.target.value })
            }
            sx={{ marginBottom: "1rem" }}
          />
          <TextField
            fullWidth
            label="Semester Reference"
            value={courseToUpdate ? courseToUpdate.semester : newCourse.semester}
            onChange={(e) =>
              courseToUpdate
                ? setCourseToUpdate({ ...courseToUpdate, semester: e.target.value })
                : setNewCourse({ ...newCourse, semester: e.target.value })
            }
            sx={{ marginBottom: "1rem" }}
          />
          <TextField
            fullWidth
            label="Total Classes"
            type="number"
            value={courseToUpdate ? courseToUpdate.totalClasses : newCourse.totalClasses}
            onChange={(e) =>
              courseToUpdate
                ? setCourseToUpdate({ ...courseToUpdate, totalClasses: e.target.value })
                : setNewCourse({
                    ...newCourse,
                    totalClasses: parseInt(e.target.value, 10) || 0,
                  })
            }
            sx={{ marginBottom: "1rem" }}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={courseToUpdate ? handleUpdateCourse : handleAddCourse}
            sx={{ marginBottom: "1rem" }}
          >
            {courseToUpdate ? "Update Course" : "Add Course"}
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
