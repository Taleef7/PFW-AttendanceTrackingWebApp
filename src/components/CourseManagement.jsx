import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  Modal,
  TextField,
  Alert,
  Snackbar,
  Divider,
  Button,
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
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  // Notification state
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationSeverity, setNotificationSeverity] = useState("success");

  const navigate = useNavigate();

  const handleCourseNameChange = (event) => {
    const value = event.target.value;
    setCourseForm({ ...courseForm, name: value });

    // Validation check for alphabets only
    const regex = /^[a-zA-Z\s]*$/;
    if (!regex.test(value)) {
      setError("Please enter a valid course name (alphabets only).");
    } else {
      setError("");
    }
  };

  const handleCourseIdChange = (event) => {
    const value = event.target.value;
    setCourseForm({ ...courseForm, ID: value });

    const regexForCourseId = /^[A-Za-z0-9-]{1,20}$/;
    if (!regexForCourseId.test(value)) {
      setError("Course ID must be 1-20 characters and can only contain letters, numbers, and hyphens.");
      return false;
    }
    setError("");
  };

  const fetchCourses = useCallback(async () => {
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
  }, [semesterId, instructorId]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const validateForm = (course) => {
    if (!course.ID.trim() || !course.name.trim()) {
      setError("Course Name and ID cannot be empty.");
      return false;
    }

    // Additional validation for course name (alphabets only)
    const regex = /^[a-zA-Z\s]*$/;
    if (!regex.test(course.name)) {
      setError("Please enter a valid course name (alphabets only).");
      return false;
    }

    const regexForCourseId = /^[A-Za-z0-9-]{1,20}$/;
    if (!regexForCourseId.test(course.ID)) {
      setError("Course ID must be 1-20 characters and can only contain letters, numbers, and hyphens.");
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
        setNotificationMessage("Course updated successfully!");
        setNotificationSeverity("success");
      } else {
        await addDoc(collection(db, "courses"), courseForm);
        setNotificationMessage("Course added successfully!");
        setNotificationSeverity("success");
      }

      setNotificationOpen(true);
      fetchCourses();
      handleCloseForm();
    } catch (error) {
      setNotificationMessage("Error saving course.");
      setNotificationSeverity("error");
      setNotificationOpen(true);
      console.error("Error saving course:", error);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    try {
      await deleteDoc(doc(db, "courses", courseId));
      setNotificationMessage("Course deleted successfully!");
      setNotificationSeverity("success");
      setNotificationOpen(true);
      fetchCourses();
    } catch (error) {
      setNotificationMessage("Error deleting course.");
      setNotificationSeverity("error");
      setNotificationOpen(true);
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

  const handleCourseClick = (course) => {
    setSelectedCourse(course);
    setConfirmationOpen(true);
  };

  const handleClassConfirmation = async (isTakingClass) => {
    if (isTakingClass) {
      try {
        const courseRef = doc(db, "courses", selectedCourse.id);
        await updateDoc(courseRef, {
          totalClasses: selectedCourse.totalClasses + 1,
        });
        setNotificationMessage("Class session recorded successfully!");
        setNotificationSeverity("success");
        setNotificationOpen(true);
      } catch (error) {
        setNotificationMessage("Error updating class session.");
        setNotificationSeverity("error");
        setNotificationOpen(true);
        console.error("Error updating total classes:", error);
      }
    }

    setConfirmationOpen(false);
    navigate(`/course-dashboard/${selectedCourse.id}`, {
      state: {
        semesterId: semesterId,
        courseName: selectedCourse.name,
        semesterName: semesterName,
      },
    });
  };

  const handleNotificationClose = () => {
    setNotificationOpen(false);
  };

  return (
    <Box
      sx={{
        maxWidth: "80%",
        margin: "2rem auto",
        textAlign: "center",
        padding: "1rem",
      }}
    >
      {/* Header with Back Button and Add Button */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
          gap: "40px",
        }}
      >
        <IconButton
          onClick={() => navigate("/dashboard")}
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
          Courses for Semester {semesterName}
        </Typography>
        <IconButton
          color="primary"
          onClick={() => handleShowForm()}
          sx={{
            backgroundColor: "#1976d2",
            color: "#fff",
            "&:hover": {
              backgroundColor: "#1565c0",
            },
          }}
          data-testid="add-course-button"
        >
          <AddIcon />
        </IconButton>
      </Box>

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
            onClick={() => handleCourseClick(course)}
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
                    data-testid="EditIcon"
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
      </Box>

      {/* Confirmation Modal */}
      <Modal
        open={confirmationOpen}
        onClose={() => setConfirmationOpen(false)}
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
            Are you taking a class today?
          </Typography>
          <Box sx={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={() => handleClassConfirmation(true)}
            >
              Yes
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              fullWidth
              onClick={() => handleClassConfirmation(false)}
            >
              No
            </Button>
          </Box>
        </Box>
      </Modal>

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
          data-testid="course-form"
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
            onChange={handleCourseIdChange}
            sx={{ marginBottom: "1rem" }}
            data-testid="course-id-input"
            error={!!error}
          />
           <TextField
            fullWidth
            label="Course Name"
            value={courseForm.name}
            onChange={handleCourseNameChange}
            data-testid="course-name-input"
            error={!!error}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleAddOrUpdateCourse}
            sx={{ marginBottom: "1rem" , marginTop: "1rem"}}
            data-testid="course-button"
          >
            {courseToEdit ? "Update Course" : "Add Course"}
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            fullWidth
            onClick={handleCloseForm}
            data-testid="cancel-button"
          >
            Cancel
          </Button>
        </Box>
      </Modal>

      {/* Notification Snackbar */}
      <Snackbar
        open={notificationOpen}
        autoHideDuration={3000}
        onClose={handleNotificationClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleNotificationClose}
          severity={notificationSeverity}
          sx={{ width: "100%" }}
          data-testid="notification"
        >
          {notificationMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CourseManagementPage;
