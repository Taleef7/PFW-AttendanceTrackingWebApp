// src/services/studentService.js
import { db } from '../services/firebaseConfig';
import { collection, addDoc } from "firebase/firestore";

export const addStudent = async (student) => {
  const studentsCollection = collection(db, 'students');
  await addDoc(studentsCollection, student);
};
