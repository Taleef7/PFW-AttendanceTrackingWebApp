import React, { useState, useEffect } from "react";
import { Box, Typography, CircularProgress, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { collection, doc, getDoc, query, where, getDocs } from "firebase/firestore";
import { db } from "../services/firebaseConfig";
import { useParams, useNavigate } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const Analytics = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [attendanceData, setAttendanceData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const courseRef = doc(collection(db, "courses"), courseId);
        const courseDoc = await getDoc(courseRef);

        if (courseDoc.exists()) {
          const courseData = courseDoc.data();
          const studentIds = courseData.students || [];
          const classDates = courseData.dates || [];

          const attendanceQuery = query(
            collection(db, "attendanceSummaries"),
            where("courseId", "==", courseId)
          );

          const attendanceSnapshot = await getDocs(attendanceQuery);

          // Initialize attendance count for each class date
          const attendanceCount = {};
          classDates.forEach((date) => {
            attendanceCount[date] = 0;
          });

          // Process attendance for each student
          attendanceSnapshot.docs.forEach((doc) => {
            const attendanceData = doc.data();
            const attendedDates = attendanceData.dates || [];

            attendedDates.forEach((date) => {
              if (attendanceCount[date] !== undefined) {
                attendanceCount[date]++;
              }
            });
          });

          setAttendanceData(attendanceCount);
        } else {
          console.error("Course not found.");
        }
      } catch (error) {
        console.error("Error fetching attendance data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceData();
  }, [courseId]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  // Prepare data for the bar chart
  const dates = Object.keys(attendanceData);
  const counts = Object.values(attendanceData);

  const data = {
    labels: dates,
    datasets: [
      {
        label: "Number of Students Attended",
        data: counts,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Class Dates",
        },
      },
      y: {
        title: {
          display: true,
          text: "Number of Students",
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <Box sx={{ maxWidth: "80%", margin: "2rem auto", textAlign: "center", position: "relative" }}>
      {/* Back Button */}
      <IconButton
        sx={{
          position: "absolute",
          top: "0",
          left: "-2rem",
          transform: "translateY(-50%)",
        }}
        onClick={() => navigate(-1)}
      >
        <ArrowBackIcon />
      </IconButton>

      {/* Header */}
      <Typography variant="h4" sx={{ marginBottom: "2rem" }}>
        Attendance Analytics
      </Typography>

      {/* Bar Chart */}
      <Bar data={data} options={options} />
    </Box>
  );
};

export default Analytics;
