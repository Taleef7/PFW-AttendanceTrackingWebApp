import { db } from "../services/firebaseConfig";
import { collection, doc, addDoc, updateDoc, getDocs, query, where } from "firebase/firestore";
import QRCode from "qrcode";

// Function to generate QR code for a student
const generateStudentQRCode = async (studentId, courseId) => {
  try {
    const qrData = JSON.stringify({
      studentId,
      courseId,
      timestamp: new Date().toISOString(),
    });
    return await QRCode.toDataURL(qrData); // Generate QR Code as Base64 string
  } catch (error) {
    console.error("Error generating QR Code:", error);
    throw error;
  }
};

// Function to add a student with a unique QR code
export const addStudent = async (student, courseId) => {
  try {
    const studentData = { ...student, courseId }; // Add courseId to the student object
    const studentsCollection = collection(db, "students");
    const studentDoc = await addDoc(studentsCollection, studentData);

    const qrCode = await generateStudentQRCode(studentDoc.id, courseId);
    await updateDoc(doc(db, "students", studentDoc.id), { qrCode });

    console.log("Student added successfully with QR code and courseId.");
    return studentDoc.id;
  } catch (error) {
    console.error("Error adding student:", error);
    throw error;
  }
};


// Function to fetch students for a specific course
export const fetchStudentsInCourse = async (courseId) => {
  try {
    const studentsRef = collection(db, "students");
    const q = query(studentsRef, where("courseId", "==", courseId));
    console.log("Fetching students for courseId:", courseId);
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.warn("No students found for courseId:", courseId);
    }

    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching students in course:", error);
    throw error;
  }
};