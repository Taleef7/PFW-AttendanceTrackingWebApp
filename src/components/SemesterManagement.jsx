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
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";

const SemesterManagement = () => {
  const instructorId = localStorage.getItem('uid');
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

  // Fetch semesters and sort by start date
  useEffect(() => {
    const fetchSemesters = async () => {
      setLoading(true);
      setError("");
      try {
        const q = query(
          collection(db, "semesters"),
          where("instructor", "==", `${instructorId}`)
        );
        const querySnapshot = await getDocs(q);
        const fetchedSemesters = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Sort semesters by start date
        fetchedSemesters.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
        setSemesters(fetchedSemesters);
      } catch (error) {
        console.error("Error fetching semesters:", error);
        setError("Failed to fetch semesters. Please try again later.");
      }
      setLoading(false);
    };

    fetchSemesters();
  }, [instructorId]);

  // Open modal for add or edit
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

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setNewSemester({ name: "", startDate: "", endDate: "" });
    setEditingSemester(null);
    setError("");
  };

  // Check for overlapping semesters
  const isDateConflict = (startDate, endDate) => {
    return semesters.some(
      (semester) =>
        new Date(startDate) <= new Date(semester.endDate) &&
        new Date(endDate) >= new Date(semester.startDate)
    );
  };

  // Add or update a semester
  const handleSaveSemester = async (e) => {
    e.preventDefault();
    setError("");

    // Validation: Ensure end date is after start date
    if (new Date(newSemester.startDate) >= new Date(newSemester.endDate)) {
      setError("End date must be greater than start date.");
      return;
    }

    // Validation: Ensure no overlapping semesters
    if (isDateConflict(newSemester.startDate, newSemester.endDate)) {
      setError("The semester dates overlap with an existing semester.");
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
          prev
            .map((semester) =>
              semester.id === editingSemester
                ? { ...semester, ...newSemester }
                : semester
            )
            .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
        );
      } else {
        const docRef = await addDoc(collection(db, "semesters"), {
          ...newSemester,
          instructor: `${instructorId}`,
        });
        setSemesters((prev) =>
          [...prev, { id: docRef.id, ...newSemester, instructor: `${instructorId}` }].sort(
            (a, b) => new Date(a.startDate) - new Date(b.startDate)
          )
        );
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
      setSemesters((prev) =>
        prev.filter((semester) => semester.id !== semesterId)
      );
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
        <Box sx={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              fontWeight: "bold",
              borderBottom: "1px solid #ddd",
              padding: "0.5rem",
            }}
          >
            <Typography sx={{ flex: 1 }}>Semester Name</Typography>
            <Typography sx={{ flex: 1 }}>Start Date</Typography>
            <Typography sx={{ flex: 1 }}>End Date</Typography>
            <Typography sx={{ flex: 1 }}>Actions</Typography>
          </Box>
          {semesters.map((semester) => (
            <Box
              key={semester.id}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0.5rem",
                borderBottom: "1px solid #ddd",
              }}
            >
              <Typography
                sx={{ flex: 1, cursor: "pointer", color: "primary.main" }}
                onClick={() => handleNavigateToCourseManagement(semester.id)}
              >
                {semester.name}
              </Typography>
              <Typography sx={{ flex: 1 }}>{semester.startDate}</Typography>
              <Typography sx={{ flex: 1 }}>{semester.endDate}</Typography>
              <Box sx={{ flex: 1, display: "flex", gap: "0.5rem" }}>
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
            </Box>
          ))}
        </Box>
      ) : (
        <Typography>No semesters found. Please add a semester.</Typography>
      )}

      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => openModal()}
        sx={{ marginTop: "1rem" }}
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
