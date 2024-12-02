import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../services/firebaseConfig"; // Import Firestore instance

const FirestoreTest = () => {
  const [data, setData] = useState(""); // State for form input
  const [message, setMessage] = useState(""); // State for success/error message

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Add a document to a collection named "testCollection"
      await addDoc(collection(db, "testCollection"), { data });
      setMessage("Data added successfully!");
      setData(""); // Clear the input field
    } catch (error) {
      console.error("Error adding document:", error);
      setMessage("Error adding data. Please try again.");
    }
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <h3>Add Data to Firestore</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={data}
          onChange={(e) => setData(e.target.value)}
          placeholder="Enter some data"
          required
          style={{
            padding: "10px",
            marginRight: "10px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Add to Firestore
        </button>
      </form>
      {message && <p style={{ marginTop: "10px", color: "green" }}>{message}</p>}
    </div>
  );
};

export default FirestoreTest;
