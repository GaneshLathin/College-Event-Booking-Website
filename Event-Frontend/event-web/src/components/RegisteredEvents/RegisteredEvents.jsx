// src/pages/RegisteredEvents.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Alert,
  CircularProgress,
} from "@mui/material";
import axios from "axios";

const RegisteredEvents = () => {
  const [events, setEvents] = useState([]);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserEvents = async () => {
      const token =
        localStorage.getItem("jwtToken") || sessionStorage.getItem("jwtToken");

      if (!token) {
        setMessage({
          type: "error",
          text: "Please login to view your registered events.",
        });
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get("http://localhost:8080/api/registrations/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Fetched Registered Events:", res.data); // Debug
        setEvents(res.data);
      } catch (error) {
        console.error("Error fetching events:", error);
        setMessage({
          type: "error",
          text: "Could not load your registered events. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserEvents();
  }, []);

  return (
    <Box sx={{ backgroundColor: "#f8f9fa", minHeight: "100vh", py: 6 }}>
      <Container>
        <Typography variant="h4" gutterBottom fontWeight={600}>
          My Registered Events
        </Typography>

        {loading && <CircularProgress />}

        {message.text && (
          <Alert severity={message.type} sx={{ my: 2 }}>
            {message.text}
          </Alert>
        )}

        <Grid container spacing={3}>
          {events.map((event) => (
            <Grid item xs={12} md={6} lg={4} key={event.id}>
              <Card elevation={3}>
                {event.image && (
                  <CardMedia
                    component="img"
                    height="180"
                    image={event.image}
                    alt={event.title}
                  />
                )}
                <CardContent>
                  <Typography variant="h6" fontWeight={600}>
                    {event.title}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    🕒 {event.startTime} - {event.endTime}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    📅 {event.date || "Date not specified"}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    👥 Team Size: {event.teamSize || 1}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    📝 {event.description}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ mt: 1, fontStyle: "italic" }}
                  >
                    📋 {event.rulesAndRegulations || "No specific rules mentioned."}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default RegisteredEvents;
