// src/pages/EventsPage.jsx
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
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../Header/Header";

const EventsPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [groupedEvents, setGroupedEvents] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    setIsLoggedIn(false);
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
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(event);
    });
    setGroupedEvents(grouped);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleRegister = (eventId) => {
    if (isLoggedIn) {
      navigate(`/registerevent/${eventId}`);
    } else {
      navigate("/login");
    }
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
    </Box>
  );
};

export default EventsPage;
