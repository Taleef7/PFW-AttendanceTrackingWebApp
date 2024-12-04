import React, { useState, useEffect } from "react";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../services/firebaseConfig"; // Assuming you have firebaseConfig set up

const CourseManagement = () => {
  const [courses, setCourses] = useState([]); // List of courses
  const [newCourse, setNewCourse] = useState({ 
    ID: "", 
    name: "", 
    instructor: "/instructors/instructor1", 
    semester: "/semesters/semester1", 
    students: [], 
    totalClasses: 0 
  });
  const [courseToUpdate, setCourseToUpdate] = useState(null); // Course to be updated

  // Fetch courses from Firestore
  const fetchCourses = async () => {
    const coursesCollection = collection(db, "courses");
    const coursesSnapshot = await getDocs(coursesCollection);
    const coursesList = coursesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setCourses(coursesList);
  };

  // Fetch courses when the component mounts
  useEffect(() => {
    fetchCourses();
  }, []);

  // Add a new course
  const handleAddCourse = async () => {
    try {
      await addDoc(collection(db, "courses"), {
        ID: newCourse.ID,
        name: newCourse.name,
        instructor: newCourse.instructor, // Reference to instructor
        semester: newCourse.semester,     // Reference to semester
        students: newCourse.students,     // Array of students
        totalClasses: newCourse.totalClasses,
      });
      alert("Course added successfully!");
      fetchCourses(); // Re-fetch the courses after adding
      setNewCourse({ ID: "", name: "", instructor: "", semester: "", students: [], totalClasses: 0 }); // Reset form
    } catch (error) {
      console.error("Error adding course: ", error);
    }
  };

  // Delete a course
  const handleDeleteCourse = async (courseId) => {
    try {
      await deleteDoc(doc(db, "courses", courseId));
      alert("Course deleted successfully!");
      fetchCourses(); // Re-fetch the courses after deletion
    } catch (error) {
      console.error("Error deleting course: ", error);
    }
  };

  // Update a course
  const handleUpdateCourse = async () => {
    if (courseToUpdate) {
      try {
        const courseRef = doc(db, "courses", courseToUpdate.id);
        await updateDoc(courseRef, {
          name: courseToUpdate.name,
          instructor: courseToUpdate.instructor, // Reference to instructor
          semester: courseToUpdate.semester,     // Reference to semester
          students: courseToUpdate.students,     // Array of students
          totalClasses: courseToUpdate.totalClasses,
        });
        alert("Course updated successfully!");
        fetchCourses(); // Re-fetch the courses after update
        setCourseToUpdate(null); // Reset after update
      } catch (error) {
        console.error("Error updating course: ", error);
      }
    }
  };

  return (
    <div>
      <h2>Course Management</h2>

      {/* Add Course Form */}
      <div>
        <h3>Add Course</h3>
        <input
          type="text"
          placeholder="Course ID"
          value={newCourse.ID}
          onChange={(e) => setNewCourse({ ...newCourse, ID: e.target.value })}
        />
        <input
          type="text"
          placeholder="Course Name"
          value={newCourse.name}
          onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Instructor Reference"
          value={newCourse.instructor}
          onChange={(e) => setNewCourse({ ...newCourse, instructor: e.target.value })}
        />
        <input
          type="text"
          placeholder="Semester Reference"
          value={newCourse.semester}
          onChange={(e) => setNewCourse({ ...newCourse, semester: e.target.value })}
        />
        <input
          type="number"
          placeholder="Total Classes"
          value={newCourse.totalClasses}
          onChange={(e) => setNewCourse({ ...newCourse, totalClasses: e.target.value })}
        />
        <button onClick={handleAddCourse}>Add Course</button>
      </div>

      {/* Update Course Form */}
      {courseToUpdate && (
        <div>
          <h3>Update Course</h3>
          <input
            type="text"
            value={courseToUpdate.name}
            onChange={(e) => setCourseToUpdate({ ...courseToUpdate, name: e.target.value })}
          />
          <input
            type="text"
            value={courseToUpdate.instructor}
            onChange={(e) => setCourseToUpdate({ ...courseToUpdate, instructor: e.target.value })}
          />
          <input
            type="text"
            value={courseToUpdate.semester}
            onChange={(e) => setCourseToUpdate({ ...courseToUpdate, semester: e.target.value })}
          />
          <input
            type="number"
            value={courseToUpdate.totalClasses}
            onChange={(e) => setCourseToUpdate({ ...courseToUpdate, totalClasses: e.target.value })}
          />
          <button onClick={handleUpdateCourse}>Update Course</button>
        </div>
      )}

      {/* List of Courses */}
      <div>
        <h3>Courses List</h3>
        <ul>
          {courses.length === 0 ? (
            <p>No courses available.</p>
          ) : (
            courses.map((course) => (
              <li key={course.id}>
                <p>{course.name}</p>
                <button onClick={() => setCourseToUpdate(course)}>Edit</button>
                <button onClick={() => handleDeleteCourse(course.id)}>Delete</button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default CourseManagement;
