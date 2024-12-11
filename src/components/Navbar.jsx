import React from "react";
import { AppBar, Toolbar, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Navbar = ({ onLogout }) => {
  const navigate = useNavigate();

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "#000000", // Black background
        color: "#ffffff",
        boxShadow: "none",
        borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* PFW Logo */}
        <Box
          component="img"
          src="/LogoDash.png" // Relative path in the public folder
          alt="PFW Logo"
          sx={{
            height: "40px",
            cursor: "pointer",
            backgroundColor: "#000000", // Black background specifically behind the logo
            padding: "0.5rem",
            borderRadius: "4px",
          }}
          onClick={() => navigate("/dashboard")} // Redirect to dashboard on click
        />

        {/* Logout Button */}
        <Button
          variant="outlined"
          sx={{
            color: "#ffffff",
            borderColor: "rgba(255, 255, 255, 0.8)",
            "&:hover": {
              borderColor: "#ffffff",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            },
          }}
          onClick={onLogout}
        >
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
