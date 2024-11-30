// src/services/attendanceSummaryService.js
import { db } from '../firebase/firebaseConfig';
import { collection, addDoc } from "firebase/firestore";

export const addAttendanceSummary = async (attendanceSummary) => {
  const attendanceSummariesCollection = collection(db, 'attendanceSummaries');
  await addDoc(attendanceSummariesCollection, attendanceSummary);
};
