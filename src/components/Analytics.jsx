import React, { useState, useEffect } from "react";
import { Box, Typography, CircularProgress, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../services/firebaseConfig";
import { useParams, useNavigate } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const Analytics = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        // Query attendanceSummaries for the given courseId
        const attendanceQuery = query(
          collection(db, "attendanceSummaries"),
          where("courseId", "==", courseId)
        );

        const attendanceSnapshot = await getDocs(attendanceQuery);

        // Group attendance by date
        const groupedAttendance = {};
        attendanceSnapshot.docs.forEach((doc) => {
          const { timestamp } = doc.data();

          // Extract the date from the timestamp (e.g., "December 15, 2024")
          const date = timestamp.split(" at")[0];

          // Increment the count for this date
          if (!groupedAttendance[date]) {
            groupedAttendance[date] = 0;
          }
          groupedAttendance[date]++;
        });

        // Convert groupedAttendance to an array of { date, count }
        const attendanceArray = Object.entries(groupedAttendance).map(([date, count]) => ({
          date,
          count,
        }));

        setAttendanceData(attendanceArray);
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
  const labels = attendanceData.map((item) => item.date);
  const counts = attendanceData.map((item) => item.count);

  const data = {
    labels,
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
          text: "Dates",
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
    <Box sx={{ maxWidth: "100%", margin: "2rem auto", textAlign: "center", position: "relative" }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
        }}
      >
        <IconButton
          onClick={() => navigate(-1)}
          sx={{
            backgroundColor: "#cccccc",
            "&:hover": {
              backgroundColor: "#b3b3b3",
            },
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4">Attendance Analytics</Typography>
      </Box>

      {/* Bar Chart */}
      <Box
        sx={{
          width: "100%", // Increase width
          height: "500px", // Set a fixed height
          margin: "0 auto", // Center the chart
        }}
      >
        <Bar
          data={data}
          options={{
            ...options,
            maintainAspectRatio: false, // Allow the chart to fill the container
          }}
        />
      </Box>
    </Box>

  );
};

export default Analytics;
