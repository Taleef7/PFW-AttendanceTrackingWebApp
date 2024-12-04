// src/CoursePage.jsx
import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Modal,
  TextField,
  Button,
} from "@mui/material";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import SendIcon from "@mui/icons-material/Send";
import ListAltIcon from "@mui/icons-material/ListAlt";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import BarChartIcon from "@mui/icons-material/BarChart";
import DescriptionIcon from "@mui/icons-material/Description";
import NoteAddIcon from "@mui/icons-material/NoteAdd";

const CoursePage = () => {
  // State to control the Add Student modal
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);

  const openAddStudentModal = () => setIsAddStudentOpen(true);
  const closeAddStudentModal = () => setIsAddStudentOpen(false);

  const actions = [
    { label: "Scan QR", icon: <QrCodeScannerIcon />, onClick: () => console.log("Scan QR clicked") },
    { label: "Send QR Codes", icon: <SendIcon />, onClick: () => console.log("Send QR Codes clicked") },
    { label: "Student List", icon: <ListAltIcon />, onClick: () => console.log("Student List clicked") },
    { label: "Import Class List", icon: <FileDownloadIcon />, onClick: () => console.log("Import Class List clicked") },
    { label: "Analytics Screen", icon: <BarChartIcon />, onClick: () => console.log("Analytics Screen clicked") },
    { label: "Generate Student Report", icon: <DescriptionIcon />, onClick: () => console.log("Generate Student Report clicked") },
    { label: "Individual Student Report", icon: <DescriptionIcon />, onClick: () => console.log("Individual Student Report clicked") },
    { label: "Add Student", icon: <NoteAddIcon />, onClick: openAddStudentModal },
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
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 6,
                  cursor: "pointer",
                },
              }}
              onClick={action.onClick}
            >
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    fontSize: "2rem",
                    color: "#673ab7",
                    marginBottom: "0.5rem",
                  }}
                >
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

      {/* Add Student Modal */}
      <Modal
        open={isAddStudentOpen}
        onClose={closeAddStudentModal}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            backgroundColor: "#fff",
            padding: "2rem",
            borderRadius: "8px",
            width: "400px",
            boxShadow: 24,
          }}
        >
          <Typography variant="h6" sx={{ marginBottom: "1rem" }}>
            Add Student
          </Typography>
          <TextField
            fullWidth
            label="Student Name"
            variant="outlined"
            sx={{ marginBottom: "1rem" }}
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            variant="outlined"
            sx={{ marginBottom: "1rem" }}
          />
          <TextField
            fullWidth
            label="ID Number"
            variant="outlined"
            sx={{ marginBottom: "1rem" }}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginBottom: "1rem" }}
            onClick={() => {
              console.log("Student added");
              closeAddStudentModal();
            }}
          >
            Add Student
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            fullWidth
            onClick={closeAddStudentModal}
          >
            Cancel
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default CoursePage;
