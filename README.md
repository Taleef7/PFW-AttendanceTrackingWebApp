https://attendance-tracking-weba-f327c.web.app/
# PFW-AttendanceTrackingWebApp
FRONTEND - REACT + MATERIAL-UI
BACKEND - FIREBASE
DATABASE - FIREBASE REALTIME

# RUN APP
npm install
npm run app


## 1. Instructor Collection
Contains login information and basic details of the instructor (only instructors log in).

{
  _id: ObjectId,
  email: String,         // Unique email for instructor login
  password: String,      // Hashed password
  name: String           // Instructor's full name
}


## 2. Student Collection
Stores unique student information. Each student can be referenced across multiple courses without duplicating details.

{
  _id: ObjectId,
  name: String,               // Student's full name
  email: String,              // Student’s email (for sending unique QR codes)
  qrCode: String,             // Unique QR code per semester for attendance across classes
  semester: ObjectId          // Reference to Semester (QR code specific to each semester)
}


## 3. Semester Collection
Each semester has a start and end date and is associated with one instructor.

{
  _id: ObjectId,
  name: String,               // Semester name (e.g., "Fall 2024")
  startDate: Date,            // Start date of the semester
  endDate: Date,              // End date of the semester
  instructor: ObjectId        // Reference to Instructor
}


## 4. Course Collection
Contains information on each course, including its semester and enrolled students.

{
  _id: ObjectId,
  name: String,                  // Course name (e.g., "Math 101")
  semester: ObjectId,            // Reference to Semester
  instructor: ObjectId,          // Reference to Instructor
  students: [ObjectId],          // Array of Student IDs (Reference to Student collection)
  totalClasses: Number           // Number of classes held so far in the course
}


## 5. AttendanceSummary Collection
Stores a summary of attendance for each student within a course, including dates they attended. This design keeps attendance tracking compact and avoids redundancy by only storing attended dates.

{
  _id: ObjectId,
  course: ObjectId,              // Reference to Course
  student: ObjectId,             // Reference to Student
  attendanceDates: [Date],       // Array of dates the student attended
  lastAttended: Date,            // Date of the most recent attendance
  attendanceCount: Number        // Total classes attended by the student in the course
}


## 6. AttendanceReport (Virtual Collection)
The report is generated dynamically based on AttendanceSummary, Student, and Course collections. This virtual approach reduces storage costs by generating reports on demand.

Report Generation Process ->
1. Filter by Date Range: Filter attendanceDates in AttendanceSummary for dates within the specified range.
2. Aggregate Data:
   - attendanceCount: Length of filtered attendanceDates.
   - lastAttended: The most recent date in attendanceDates.
   - totalClasses: Retrieved from the Course document.
3. Attendance Percentage: Calculated as (attendanceCount / totalClasses) * 100.
