// CoursePage.jsx
import React from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import SendIcon from "@mui/icons-material/Send";
import ListAltIcon from "@mui/icons-material/ListAlt";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import BarChartIcon from "@mui/icons-material/BarChart";
import DescriptionIcon from "@mui/icons-material/Description";
import NoteAddIcon from "@mui/icons-material/NoteAdd";

const CoursePage = () => {
  // Actions for the grid
  const actions = [
    { label: "Scan QR", icon: <QrCodeScannerIcon /> },
    { label: "Send QR Codes", icon: <SendIcon /> },
    { label: "Student List", icon: <ListAltIcon /> },
    { label: "Import Class List", icon: <FileDownloadIcon /> },
    { label: "Analytics Screen", icon: <BarChartIcon /> },
    { label: "Generate Student Report", icon: <DescriptionIcon /> },
    { label: "Individual Student Report", icon: <DescriptionIcon /> },
    { label: "Add Student", icon: <NoteAddIcon /> },
  ];

  return (
    <Box
      sx={{
        maxWidth: "80%",
        margin: "2rem auto",
        textAlign: "center",
        padding: "1rem",
      }}
    >
      {/* Header */}
      <Typography variant="h4" component="h1" sx={{ marginBottom: "1.5rem" }}>
        Software Engineering
      </Typography>

      {/* Action Grid */}
      <Grid container spacing={3}>
        {actions.map((action, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <Card
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "1rem",
                boxShadow: 3,
                transition: "transform 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 6,
                },
              }}
            >
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Box sx={{ fontSize: "2rem", color: "#673ab7", marginBottom: "0.5rem" }}>
                  {action.icon}
                </Box>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {action.label}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CoursePage;
