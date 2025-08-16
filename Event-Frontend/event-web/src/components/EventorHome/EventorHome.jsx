import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Grid,
  Container,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { assets } from "../../assests/assests"; // adjust this path

export default function EventorHome() {
  const navigate = useNavigate();

  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  // State to track login status
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check for JWT token in localStorage when the component mounts
    const token = localStorage.getItem("jwtToken");
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }

    const eventDate = new Date("2025-10-17T00:00:00").getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = eventDate - now;

      if (diff <= 0) {
        clearInterval(interval);
        setTimeLeft({
          days: "00",
          hours: "00",
          minutes: "00",
          seconds: "00",
        });
      } else {
        const days = String(Math.floor(diff / (1000 * 60 * 60 * 24))).padStart(
          2,
          "0"
        );
        const hours = String(
          Math.floor((diff / (1000 * 60 * 60)) % 24)
        ).padStart(2, "0");
        const minutes = String(
          Math.floor((diff / (1000 * 60)) % 60)
        ).padStart(2, "0");
        const seconds = String(Math.floor((diff / 1000) % 60)).padStart(2, "0");

        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []); // Empty dependency array means this runs once on mount

  const handleLogout = () => {
    localStorage.removeItem("jwtToken"); // Remove the token
    setIsLoggedIn(false); // Update login status
    navigate("/"); // Redirect to home page after logout (which is EventorHome)
  };

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: "100vh",
        backgroundColor: "black",
        color: "white",
        overflow: "hidden",
      }}
    >
      {/* Background Image */}
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          top: 0,
          left: 0,
          zIndex: 1,
          opacity: 0.7,
        }}
      >
        <source src="/event-bg.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url('/fallback.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          zIndex: 0,
        }}
      />

      {/* Navbar */}
      <AppBar
        position="absolute"
        sx={{ background: "transparent", boxShadow: "none", zIndex: 2 }}
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
            <Button sx={{ color: "white", ":hover": { color: "#ff4081" } }}>
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

            {/* Conditional rendering for Login/Logout/Register buttons */}
            {isLoggedIn ? (
              <>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#651fff",
                    ":hover": { backgroundColor: "#4527a0" },
                  }}
                  onClick={() => navigate("/registered-events")} // Navigates to the /events page
                >
                  VIEW EVENTS
                </Button>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#ff4081", // Different color for logout
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
                  variant="outlined" // Use outlined for register to differentiate
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

      {/* Main Content (remains the same) */}
      <Container
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          zIndex: 2,
          transform: "translate(-50%, -50%)",
          textAlign: "center",
        }}
      >
        {/* Countdown Timer */}
        <Grid container justifyContent="center" spacing={2} mb={4}>
          <Grid item>
            <Box
              sx={{
                backgroundColor: "#f44336",
                p: 2,
                borderRadius: 1,
                minWidth: 75,
              }}
            >
              <Typography variant="h6" fontWeight="bold">
                {timeLeft.days}
              </Typography>
              <Typography variant="body2">Days</Typography>
            </Box>
          </Grid>
          <Grid item>
            <Box
              sx={{
                backgroundColor: "#2196f3",
                p: 2,
                borderRadius: 1,
                minWidth: 75,
              }}
            >
              <Typography variant="h6" fontWeight="bold">
                {timeLeft.hours}
              </Typography>
              <Typography variant="body2">Hours</Typography>
            </Box>
          </Grid>
          <Grid item>
            <Box
              sx={{
                backgroundColor: "#4caf50",
                p: 2,
                borderRadius: 1,
                minWidth: 75,
              }}
            >
              <Typography variant="h6" fontWeight="bold">
                {timeLeft.minutes}
              </Typography>
              <Typography variant="body2">Minutes</Typography>
            </Box>
          </Grid>
          <Grid item>
            <Box
              sx={{
                backgroundColor: "#ff9800",
                p: 2,
                borderRadius: 1,
                minWidth: 75,
              }}
            >
              <Typography variant="h6" fontWeight="bold">
                {timeLeft.seconds}
              </Typography>
              <Typography variant="body2">Seconds</Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Event Info */}
        <Typography variant="h3" fontWeight="bold" mb={2}>
          TALENTIA × RETWEET
        </Typography>
        <Typography variant="h6" mb={1}>
          OCTOBER, 17<sup>th</sup> - 19<sup>th</sup>, 2025
        </Typography>
        <Typography variant="subtitle1" mb={3}>
          Easwari Engineering College, Ramapuram, Chennai
        </Typography>

        <Button
          variant="contained"
          sx={{
            backgroundColor: "#e91e63",
            px: 4,
            py: 1.5,
            fontWeight: "bold",
            ":hover": { backgroundColor: "#c2185b" },
          }}
          onClick={() => navigate("/events")}
        >
          EXPLORE EVENTS
        </Button>
      </Container>
    </Box>
  );
}