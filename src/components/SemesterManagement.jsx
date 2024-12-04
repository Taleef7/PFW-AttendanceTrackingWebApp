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

const SemesterManagement = ({ instructorId }) => {
  const [semesters, setSemesters] = useState([]); // List of semesters
  // const [selectedSemester, setSelectedSemester] = useState(""); // Current semester
  const [newSemester, setNewSemester] = useState({
    name: "",
    startDate: "",
    endDate: "",
  }); // New semester details
  const [editMode, setEditMode] = useState(false); // Toggle edit mode
  const [editingSemesterId, setEditingSemesterId] = useState(null); // Store the ID of the semester being edited
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // To handle errors

  // Fetch semesters for the instructor
  useEffect(() => {
    const fetchSemesters = async () => {
      setLoading(true);
      setError(""); // Reset errors
      try {
        const q = query(
          collection(db, "semesters"),
          where("instructor", "==", `/instructors/${instructorId}`) // Filter by instructor reference
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

  // Add a new semester
  const handleAddSemester = async (e) => {
    e.preventDefault();
    setError(""); // Reset errors
    try {
      if (!newSemester.name || !newSemester.startDate || !newSemester.endDate) {
        setError("All fields are required.");
        return;
      }
      await addDoc(collection(db, "semesters"), {
        ...newSemester,
        instructor: `/instructors/${instructorId}`, // Add instructor reference
      });
      alert("Semester added successfully!");
      setNewSemester({ name: "", startDate: "", endDate: "" });
      setEditMode(false);
      // Refresh semesters list
      setSemesters((prev) => [
        ...prev,
        { ...newSemester, instructor: `/instructors/${instructorId}` },
      ]);
    } catch (error) {
      console.error("Error adding semester:", error);
      setError("Failed to add semester. Please try again.");
    }
  };

  // Edit a semester
  const handleEditSemester = async (e) => {
    e.preventDefault();
    setError(""); // Reset errors
    try {
      if (!newSemester.name || !newSemester.startDate || !newSemester.endDate) {
        setError("All fields are required.");
        return;
      }
      const semesterRef = doc(db, "semesters", editingSemesterId);
      await updateDoc(semesterRef, newSemester);
      alert("Semester updated successfully!");
      setSemesters((prev) =>
        prev.map((semester) =>
          semester.id === editingSemesterId
            ? { ...semester, ...newSemester }
            : semester
        )
      );
      setNewSemester({ name: "", startDate: "", endDate: "" });
      setEditMode(false);
      setEditingSemesterId(null);
    } catch (error) {
      console.error("Error updating semester:", error);
      setError("Failed to update semester. Please try again.");
    }
  };

  // Remove a semester
  const handleRemoveSemester = async (semesterId) => {
    setError(""); // Reset errors
    try {
      await deleteDoc(doc(db, "semesters", semesterId));
      alert("Semester removed successfully!");
      setSemesters((prev) =>
        prev.filter((semester) => semester.id !== semesterId)
      );
    } catch (error) {
      console.error("Error deleting semester:", error);
      setError("Failed to delete semester. Please try again.");
    }
  };

  // Populate form for editing a semester
  const handlePopulateForEdit = (semester) => {
    setNewSemester({
      name: semester.name,
      startDate: semester.startDate,
      endDate: semester.endDate,
    });
    setEditMode(true);
    setEditingSemesterId(semester.id);
  };

  return (
    <div className="semester-management-container">
      <h3>Semester Management</h3>

      {/* Error Message */}
      {error && <p className="error-message">{error}</p>}

      {/* Loading State */}
      {loading ? (
        <p>Loading semesters...</p>
      ) : (
        <>
          {/* Add/Edit Semester Form */}
          <form
            onSubmit={editMode ? handleEditSemester : handleAddSemester}
            className="semester-form"
          >
            <h4>{editMode ? "Edit Semester" : "Add New Semester"}</h4>
            <input
              type="text"
              placeholder="Semester Name"
              value={newSemester.name}
              onChange={(e) =>
                setNewSemester({ ...newSemester, name: e.target.value })
              }
              required
            />
            <input
              type="date"
              value={newSemester.startDate}
              onChange={(e) =>
                setNewSemester({ ...newSemester, startDate: e.target.value })
              }
              required
            />
            <input
              type="date"
              value={newSemester.endDate}
              onChange={(e) =>
                setNewSemester({ ...newSemester, endDate: e.target.value })
              }
              required
            />
            <button type="submit" disabled={loading}>
              {editMode ? "Update Semester" : "Add Semester"}
            </button>
            {editMode && (
              <button
                type="button"
                onClick={() => {
                  setEditMode(false);
                  setNewSemester({ name: "", startDate: "", endDate: "" });
                  setEditingSemesterId(null);
                }}
              >
                Cancel
              </button>
            )}
          </form>

          {/* Semester List */}
          {semesters.length > 0 ? (
            <div className="semester-list">
              {semesters.map((semester) => (
                <div key={semester.id} className="semester-item">
                  <p>
                    {semester.name} ({semester.startDate} - {semester.endDate})
                  </p>
                  <button onClick={() => handlePopulateForEdit(semester)}>
                    Edit
                  </button>
                  <button onClick={() => handleRemoveSemester(semester.id)}>
                    Remove
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p>No semesters found. Please add a semester to get started.</p>
          )}
        </>
      )}
    </div>
  );
};

export default SemesterManagement;
