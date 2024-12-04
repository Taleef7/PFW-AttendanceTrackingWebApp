import React, { useState, useEffect } from "react";
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
import {
  Box,
  Typography,
  Button,
  Modal,
  TextField,
  Card,
  CardContent,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";

const SemesterManagement = ({ instructorId }) => {
  const [semesters, setSemesters] = useState([]);
  const [newSemester, setNewSemester] = useState({
    name: "",
    startDate: "",
    endDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSemester, setEditingSemester] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSemesters = async () => {
      setLoading(true);
      setError("");
      try {
        const q = query(
          collection(db, "semesters"),
          where("instructor", "==", `/instructors/${instructorId}`)
        );
        const querySnapshot = await getDocs(q);
        const fetchedSemesters = [];
        querySnapshot.forEach((doc) => {
          fetchedSemesters.push({ id: doc.id, ...doc.data() });
        });
        setSemesters(fetchedSemesters);
      } catch (error) {
        console.error("Error fetching semesters:", error);
        setError("Failed to fetch semesters. Please try again later.");
      }
      setLoading(false);
    };

    fetchSemesters();
  }, [instructorId]);

  const openModal = (semester = null) => {
    if (semester) {
      setNewSemester({
        name: semester.name,
        startDate: semester.startDate,
        endDate: semester.endDate,
      });
      setEditingSemester(semester.id);
    } else {
      setNewSemester({ name: "", startDate: "", endDate: "" });
      setEditingSemester(null);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNewSemester({ name: "", startDate: "", endDate: "" });
    setEditingSemester(null);
    setError("");
  };

  const handleSaveSemester = async (e) => {
    e.preventDefault();
    setError("");

    // Validation: Ensure end date is after start date
    if (new Date(newSemester.startDate) >= new Date(newSemester.endDate)) {
      setError("End date must be greater than start date.");
      return;
    }

    if (!newSemester.name || !newSemester.startDate || !newSemester.endDate) {
      setError("All fields are required.");
      return;
    }

    try {
      if (editingSemester) {
        const semesterRef = doc(db, "semesters", editingSemester);
        await updateDoc(semesterRef, newSemester);
        setSemesters((prev) =>
          prev.map((semester) =>
            semester.id === editingSemester
              ? { ...semester, ...newSemester }
              : semester
          )
        );
        alert("Semester updated successfully!");
      } else {
        const docRef = await addDoc(collection(db, "semesters"), {
          ...newSemester,
          instructor: `/instructors/${instructorId}`,
        });
        setSemesters([
          ...semesters,
          { id: docRef.id, ...newSemester, instructor: `/instructors/${instructorId}` },
        ]);
        alert("Semester added successfully!");
      }

      closeModal();
    } catch (error) {
      console.error("Error saving semester:", error);
      setError("Failed to save semester. Please try again.");
    }
  };

  const handleRemoveSemester = async (semesterId) => {
    setError("");
    try {
      await deleteDoc(doc(db, "semesters", semesterId));
      alert("Semester removed successfully!");
      setSemesters((prev) => prev.filter((semester) => semester.id !== semesterId));
    } catch (error) {
      console.error("Error deleting semester:", error);
      setError("Failed to delete semester. Please try again.");
    }
  };

  const handleNavigateToCourseManagement = (semesterId) => {
    navigate(`/course-management/${semesterId}`);
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ marginBottom: "1rem" }}>
        Semester Management
      </Typography>

      {loading ? (
        <Typography>Loading semesters...</Typography>
      ) : semesters.length > 0 ? (
        <Box
          sx={{
            display: "flex",
            gap: "1rem",
            flexWrap: "wrap",
            marginBottom: "1rem",
          }}
        >
          {semesters.map((semester) => (
            <Card
              key={semester.id}
              sx={{
                minWidth: "250px",
                padding: "1rem",
                boxShadow: 3,
                borderRadius: "8px",
                cursor: "pointer",
              }}
              onClick={() => handleNavigateToCourseManagement(semester.id)}
            >
              <CardContent>
                <Typography variant="h6">{semester.name}</Typography>
                <Typography variant="body2">
                  {semester.startDate} - {semester.endDate}
                </Typography>
                <Box sx={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
                  <IconButton
                    color="primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      openModal(semester);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveSemester(semester.id);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      ) : (
        <Typography>No semesters found. Please add a semester.</Typography>
      )}

      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => openModal()}
      >
        Add Semester
      </Button>

      <Modal
        open={isModalOpen}
        onClose={closeModal}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            width: 400,
            backgroundColor: "#fff",
            padding: "2rem",
            borderRadius: "8px",
            boxShadow: 24,
          }}
        >
          <Typography variant="h6" sx={{ marginBottom: "1rem" }}>
            {editingSemester ? "Edit Semester" : "Add Semester"}
          </Typography>
          {error && (
            <Typography color="error" sx={{ marginBottom: "1rem" }}>
              {error}
            </Typography>
          )}
          <form onSubmit={handleSaveSemester}>
            <TextField
              fullWidth
              label="Semester Name"
              value={newSemester.name}
              onChange={(e) =>
                setNewSemester({ ...newSemester, name: e.target.value })
              }
              sx={{ marginBottom: "1rem" }}
              required
            />
            <TextField
              fullWidth
              type="date"
              label="Start Date"
              InputLabelProps={{ shrink: true }}
              value={newSemester.startDate}
              onChange={(e) =>
                setNewSemester({ ...newSemester, startDate: e.target.value })
              }
              sx={{ marginBottom: "1rem" }}
              required
            />
            <TextField
              fullWidth
              type="date"
              label="End Date"
              InputLabelProps={{ shrink: true }}
              value={newSemester.endDate}
              onChange={(e) =>
                setNewSemester({ ...newSemester, endDate: e.target.value })
              }
              sx={{ marginBottom: "1rem" }}
              required
            />
            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
              <Button variant="outlined" onClick={closeModal}>
                Cancel
              </Button>
              <Button type="submit" variant="contained">
                {editingSemester ? "Update Semester" : "Add Semester"}
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </Box>
  );
};

export default SemesterManagement;
