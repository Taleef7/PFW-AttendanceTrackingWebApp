import React from "react";
import { AppBar, Toolbar, Box, IconButton, Tooltip } from "@mui/material";
import ExitToAppIcon from "@mui/icons-material/ExitToApp"; // Door icon for logout
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
        {/* New Logo */}
        <Box
          component="img"
          src="/LogoDash.png" // Updated logo path
          alt="Dashboard Logo"
          sx={{
            height: "40px",
            cursor: "pointer",
            backgroundColor: "#000000", // Black background specifically behind the logo
            padding: "0.5rem",
            borderRadius: "4px",
          }}
          onClick={() => navigate("/dashboard")} // Redirect to dashboard on click
        />

        {/* Logout Icon with Tooltip */}
        <Tooltip title="Logout">
          <IconButton
            color="inherit"
            onClick={onLogout}
            sx={{
              "&:hover": {
                color: "rgba(255, 255, 255, 0.8)",
              },
            }}
          >
            <ExitToAppIcon fontSize="large" />
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
