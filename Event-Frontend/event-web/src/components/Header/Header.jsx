import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { assets } from "../../assests/assests";

const Header = ({ isLoggedIn, handleLogout }) => {
  const navigate = useNavigate();

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: "#000", // solid black
        boxShadow: "none",
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", px: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <img src={assets.logo} alt="Eventor Logo" style={{ height: 40 }} />
          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", color: "#ff4081" }}
          >
            CAMPUS LIFE
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 3 }}>
          <Button
            sx={{ color: "white", ":hover": { color: "#ff4081" } }}
            onClick={() => navigate("/")}
          >
            HOME
          </Button>
          <Button
            sx={{ color: "white", ":hover": { color: "#ff4081" } }}
            onClick={() => navigate("/about")}
          >
            ABOUT
          </Button>
          <Button
            onClick={() => navigate("/contact")}
            sx={{ color: "white", ":hover": { color: "#ff4081" } }}
          >
            CONTACT
          </Button>

          {isLoggedIn ? (
            <>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#651fff",
                  ":hover": { backgroundColor: "#4527a0" },
                }}
                onClick={() => navigate("/registered-events")}
              >
                VIEW EVENTS
              </Button>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#ff4081",
                  ":hover": { backgroundColor: "#c51162" },
                }}
                onClick={handleLogout}
              >
                LOGOUT
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#651fff",
                  ":hover": { backgroundColor: "#4527a0" },
                }}
                onClick={() => navigate("/login")}
              >
                LOGIN
              </Button>
              <Button
                variant="outlined"
                sx={{
                  color: "#651fff",
                  borderColor: "#651fff",
                  ":hover": { borderColor: "#4527a0", color: "#4527a0" },
                }}
                onClick={() => navigate("/register")}
              >
                REGISTER
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;