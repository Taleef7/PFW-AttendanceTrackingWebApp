// src/services/instructorService.js
import { db } from '../services/firebaseConfig';
import { collection, addDoc } from "firebase/firestore";

export const addInstructor = async (instructor) => {
  const instructorsCollection = collection(db, 'instructors');
  await addDoc(instructorsCollection, instructor);
};
