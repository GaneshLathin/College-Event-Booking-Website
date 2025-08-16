// src/pages/RegisterEvent.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Container,
  CircularProgress,
  Button,
  Paper,
  Alert,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const RegisterEvent = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [checkDone, setCheckDone] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/events/${id}`);
        setEvent(res.data);
      } catch (error) {
        console.error("Failed to fetch event:", error);
      } finally {
        setLoading(false);
      }
    };

    const checkRegistration = async () => {
      const token = localStorage.getItem("jwtToken");
      if (!token) return;

      try {
        const res = await axios.get("http://localhost:8080/api/registrations/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const already = res.data.some((ev) => ev.id === id);
        setIsRegistered(already);
      } catch (err) {
        console.error("Error checking registration:", err);
      } finally {
        setCheckDone(true);
      }
    };

    fetchEvent();
    checkRegistration();
  }, [id]);

  if (loading || !checkDone) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "#121212",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!event) {
    return (
      <Container sx={{ py: 10 }}>
        <Typography variant="h4" color="error">
          Event not found.
        </Typography>
        <Button onClick={() => navigate("/events")} variant="contained" sx={{ mt: 2 }}>
          Back to Events
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ backgroundColor: "#121212", color: "#fff", minHeight: "100vh", py: 6 }}>
      <Box
        component="img"
        src={event.image}
        alt={event.title}
        sx={{
          width: "100%",
          height: { xs: 300, md: 500 },
          objectFit: "cover",
          mb: 4,
        }}
      />

      <Container maxWidth="md">
        <Paper
          elevation={4}
          sx={{
            backgroundColor: "#1e1e1e",
            color: "#fff",
            p: { xs: 3, md: 5 },
            borderRadius: 4,
          }}
        >
          <Typography variant="h3" fontWeight={700} gutterBottom>
            {event.title}
          </Typography>

          <Typography variant="h6" gutterBottom>
            <strong>Category:</strong> {event.category}
          </Typography>

          <Typography variant="h6" gutterBottom>
            📅 <strong>Date:</strong> {event.date}
          </Typography>
          <Typography variant="h6" gutterBottom>
            🕒 <strong>Start Time:</strong> {event.startTime}
          </Typography>
          <Typography variant="h6" gutterBottom>
            🕔 <strong>End Time:</strong> {event.endTime}
          </Typography>

          <Box sx={{ my: 3 }}>
            <Typography variant="h6" gutterBottom>
              📝 Description
            </Typography>
            <Typography variant="body1" color="gray">
              {event.description}
            </Typography>
          </Box>

          <Box sx={{ my: 3 }}>
            <Typography variant="h6" gutterBottom>
              📋 Rules & Regulations
            </Typography>
            <Typography variant="body2" color="gray">
              {event.rulesAndRegulations || "No specific rules mentioned."}
            </Typography>
          </Box>

          {event.registrationClosed && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              Registration for this event is closed.
            </Alert>
          )}

          {isRegistered && (
            <Alert severity="info" sx={{ mb: 2 }}>
              You are already registered for this event.
            </Alert>
          )}

          <Button
            variant="contained"
            color={isRegistered ? "success" : "primary"}
            fullWidth
            sx={{ mt: 4, py: 1.5, fontWeight: "bold", fontSize: "1.1rem" }}
            disabled={isRegistered || event.registrationClosed}
            onClick={() => navigate(`/registration/${id}`)}
          >
            {isRegistered
              ? "Registered"
              : event.registrationClosed
              ? "Registration Closed"
              : "Confirm Registration"}
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default RegisterEvent;
