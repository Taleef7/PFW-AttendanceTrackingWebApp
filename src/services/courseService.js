// src/services/courseService.js
import { db } from '../services/firebaseConfig';

export const addCourse = async (course) => {
  await db.collection('courses').add(course);
};

// Get courses for a specific semester
export const getCoursesBySemester = async (semesterId) => {
  const querySnapshot = await db.collection('courses').where('semester', '==', semesterId).get();
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};