import React, { useState, useEffect } from "react";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, query, where } from "firebase/firestore";
import { db } from "../services/firebaseConfig";

const SemesterManagement = ({ instructorId }) => {
  const [semesters, setSemesters] = useState([]); // List of semesters
  const [selectedSemester, setSelectedSemester] = useState(""); // Current semester
  const [newSemester, setNewSemester] = useState({ name: "", startDate: "", endDate: "" }); // New semester details
  const [loading, setLoading] = useState(false);

  // Fetch semesters for the instructor
  useEffect(() => {
    const fetchSemesters = async () => {
      setLoading(true);
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
      }
      setLoading(false);
    };

    fetchSemesters();
  }, [instructorId]);

  // Add a new semester
  const handleAddSemester = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "semesters"), {
        ...newSemester,
        instructor: `/instructors/${instructorId}`, // Add instructor reference
      });
      alert("Semester added successfully!");
      setNewSemester({ name: "", startDate: "", endDate: "" });
      // Refresh semesters list
      setSemesters((prev) => [...prev, { ...newSemester, instructor: `/instructors/${instructorId}` }]);
    } catch (error) {
      console.error("Error adding semester:", error);
    }
  };

  // Edit a semester
  const handleEditSemester = async (semesterId, updatedSemester) => {
    try {
      const semesterRef = doc(db, "semesters", semesterId);
      await updateDoc(semesterRef, updatedSemester);
      alert("Semester updated successfully!");
      setSemesters((prev) =>
        prev.map((semester) =>
          semester.id === semesterId ? { ...semester, ...updatedSemester } : semester
        )
      );
    } catch (error) {
      console.error("Error updating semester:", error);
    }
  };

  // Remove a semester
  const handleRemoveSemester = async (semesterId) => {
    try {
      await deleteDoc(doc(db, "semesters", semesterId));
      alert("Semester removed successfully!");
      setSemesters((prev) => prev.filter((semester) => semester.id !== semesterId));
    } catch (error) {
      console.error("Error deleting semester:", error);
    }
  };

  return (
    <div>
      <h3>Semester Management</h3>

      {/* Semester Selector */}
      <div>
        <label>Select Semester:</label>
        <select
          value={selectedSemester}
          onChange={(e) => setSelectedSemester(e.target.value)}
        >
          <option value="">-- Select Semester --</option>
          {semesters.map((semester) => (
            <option key={semester.id} value={semester.id}>
              {semester.name}
            </option>
          ))}
        </select>
      </div>

      {/* Add Semester Form */}
      <form onSubmit={handleAddSemester}>
        <h4>Add New Semester</h4>
        <input
          type="text"
          placeholder="Semester Name"
          value={newSemester.name}
          onChange={(e) => setNewSemester({ ...newSemester, name: e.target.value })}
          required
        />
        <input
          type="date"
          placeholder="Start Date"
          value={newSemester.startDate}
          onChange={(e) => setNewSemester({ ...newSemester, startDate: e.target.value })}
          required
        />
        <input
          type="date"
          placeholder="End Date"
          value={newSemester.endDate}
          onChange={(e) => setNewSemester({ ...newSemester, endDate: e.target.value })}
          required
        />
        <button type="submit" disabled={loading}>
          Add Semester
        </button>
      </form>

      {/* Edit and Remove Semesters */}
      <div>
        {semesters.map((semester) => (
          <div key={semester.id}>
            <p>
              {semester.name} ({semester.startDate} - {semester.endDate})
            </p>
            <button
              onClick={() =>
                handleEditSemester(semester.id, {
                  name: "Updated Name",
                  startDate: "2024-09-01",
                  endDate: "2024-12-31",
                })
              }
            >
              Edit
            </button>
            <button onClick={() => handleRemoveSemester(semester.id)}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SemesterManagement;
