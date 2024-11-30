// src/services/semesterService.js
import { db } from '../firebase/firebaseConfig';

export const addSemester = async (semester) => {
  await db.collection('semesters').add(semester);
};

// Get all semesters for an instructor
export const getSemestersByInstructor = async (instructorId) => {
  const querySnapshot = await db.collection('semesters').where('instructor', '==', instructorId).get();
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};