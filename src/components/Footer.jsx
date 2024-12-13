import React from "react";
import { Box, Typography, Link } from "@mui/material";

const Footer = () => {
  return (
    <Box
      sx={{
        backgroundColor: "#1c1c1c",
        color: "#fff",
        padding: "1rem 0",
        textAlign: "center",
        position: "relative",
        bottom: 0,
        width: "100%",
      }}
    >
      <Typography variant="body2" sx={{ marginBottom: "0.5rem" }}>
        © 2024 Attendance Tracker. All rights reserved.
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
        <Link href="/privacy-policy" underline="hover" color="inherit">
          Privacy Policy
        </Link>
        <Link href="/terms-of-service" underline="hover" color="inherit">
          Terms of Service
        </Link>
      </Box>
    </Box>
  );
};

export default Footer;
