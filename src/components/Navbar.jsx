import React from "react";
import { AppBar, Toolbar, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { logout } from "../services/authService";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error.message);
    }
  };

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "#000000",
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
            backgroundColor: "#000000",
            padding: "0.5rem",
            borderRadius: "4px",
          }}
          onClick={() => navigate("/dashboard")}
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
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
