import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Container,
  Divider,
  Button,
  Fab,
  Tooltip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../Header/Header";
import ChatIcon from '@mui/icons-material/Chat';

const EventsPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [groupedEvents, setGroupedEvents] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const storedData = localStorage.getItem("jwtToken");
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        setIsLoggedIn(true);
        setUserRole(parsed.role); // store the role
      } catch (err) {
        console.error("Failed to parse JWT token:", err);
        localStorage.removeItem("jwtToken");
        setIsLoggedIn(false);
        setUserRole(null);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    setIsLoggedIn(false);
    setUserRole(null);
  };

  const fetchEvents = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/events");
      groupByCategory(res.data);
    } catch (error) {
      console.error("Failed to fetch events", error);
    }
  };

  const groupByCategory = (events) => {
    const grouped = {};
    events.forEach((event) => {
      const category = event.category || "Uncategorized";
      if (!grouped[category]) grouped[category] = [];
      grouped[category].push(event);
    });
    setGroupedEvents(grouped);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleRegister = (eventId) => {
    if (!isLoggedIn || userRole !== "STUDENT") {
      alert("Invalid credentials or not a student");
      navigate("/login");
    } else {
      navigate(`/registerevent/${eventId}`);
    }
  };

  const handleChatbotClick = () => {
    navigate("/chatbot");
  };

  return (
    <Box
      sx={{
        backgroundImage: `url(${require("../../assests/image2.jpg")})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "top center",
        backgroundSize: "100% 100%",
        backgroundAttachment: "fixed",
        backgroundColor: "#000",
        color: "#fff",
        minHeight: "100vh",
        width: "100%",
        position: "relative",
      }}
    >
      <Header isLoggedIn={isLoggedIn} handleLogout={handleLogout} />

      <Container sx={{ py: 10 }}>
        <Typography variant="h3" textAlign="center" fontWeight={700} gutterBottom>
          Events by Category
        </Typography>

        {Object.entries(groupedEvents).map(([category, events]) => (
          <Box key={category} sx={{ mb: 6 }}>
            <Typography variant="h5" fontWeight={600} sx={{ mb: 2, mt: 4 }}>
              {category}
            </Typography>
            <Divider sx={{ mb: 3, width: 80, borderBottom: "3px solid #fff" }} />

            <Grid container spacing={4}>
              {events.map((event) => (
                <Grid item xs={12} sm={6} md={4} key={event.id}>
                  <Card
                    sx={{
                      borderRadius: 3,
                      overflow: "hidden",
                      height: "100%",
                      width: "300px",
                      backgroundColor: "#fff",
                      color: "#000",
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                      "&:hover": {
                        transform: "scale(1.05)",
                        boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.3)",
                      },
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={event.image}
                      alt={event.title}
                      sx={{ height: 150, width: "100%", objectFit: "cover" }}
                    />
                    <CardContent
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        minHeight: 180,
                      }}
                    >
                      <Box>
                        <Typography variant="h6" fontWeight={600}>
                          {event.title}
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                          <strong>Date:</strong> {event.date}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Time:</strong> {event.startTime} - {event.endTime}
                        </Typography>
                      </Box>

                      <Button
                        variant="contained"
                        fullWidth
                        disabled={event.registrationClosed}
                        sx={{
                          backgroundColor: event.registrationClosed ? "gray" : "#800000",
                          color: "#fff",
                          fontWeight: "bold",
                          textTransform: "none",
                          borderRadius: 2,
                          mt: 2,
                          "&:hover": {
                            backgroundColor: event.registrationClosed ? "gray" : "#5a0000",
                          },
                        }}
                        onClick={() => handleRegister(event.id)}
                      >
                        {event.registrationClosed ? "Registration Closed" : "Apply Now"}
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        ))}
      </Container>

      {/* Floating Chatbot Button */}
      <Tooltip title="Chat with AI Assistant" placement="left">
        <Fab
          onClick={handleChatbotClick}
          sx={{
            position: "fixed",
            bottom: 24,
            right: 24,
            backgroundColor: "#800000",
            color: "#fff",
            width: 60,
            height: 60,
            boxShadow: "0 6px 20px rgba(128, 0, 0, 0.4)",
            transition: "all 0.3s ease",
            zIndex: 1000,
            "&:hover": {
              backgroundColor: "#5a0000",
              transform: "scale(1.1)",
              boxShadow: "0 8px 25px rgba(128, 0, 0, 0.6)",
            },
            "&:active": {
              transform: "scale(0.95)",
            },
          }}
        >
          <ChatIcon sx={{ fontSize: 28 }} />
        </Fab>
      </Tooltip>

      {/* Optional: Pulsing animation for the chatbot button */}
      <style>
        {`
          @keyframes chatbotPulse {
            0% {
              box-shadow: 0 6px 20px rgba(128, 0, 0, 0.4), 0 0 0 0 rgba(128, 0, 0, 0.7);
            }
            70% {
              box-shadow: 0 6px 20px rgba(128, 0, 0, 0.4), 0 0 0 10px rgba(128, 0, 0, 0);
            }
            100% {
              box-shadow: 0 6px 20px rgba(128, 0, 0, 0.4), 0 0 0 0 rgba(128, 0, 0, 0);
            }
          }
        `}
      </style>
    </Box>
  );
};

export default EventsPage;