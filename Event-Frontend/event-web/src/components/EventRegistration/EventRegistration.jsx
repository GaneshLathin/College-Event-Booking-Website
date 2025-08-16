// src/pages/EventRegistration.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  Divider,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EventRegistration = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [teamMembers, setTeamMembers] = useState([]);
  const [event, setEvent] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/events/${id}`);
        setEvent(res.data);

        const size = res.data.teamSize || 1;
        const initialMembers = Array.from({ length: size }, () => ({
          name: "",
          email: "",
          phone: "",
        }));
        setTeamMembers(initialMembers);
      } catch (err) {
        setMessage({ type: "error", text: "Event not found." });
      }
    };
    fetchEvent();
  }, [id]);

  const handleChange = (index, field, value) => {
    const updated = [...teamMembers];
    updated[index][field] = value;
    setTeamMembers(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const incomplete = teamMembers.some(
      (member) => !member.name || !member.email || !member.phone
    );

    if (incomplete) {
      setMessage({
        type: "error",
        text: "All fields are required for each team member.",
      });
      return;
    }

    const token = localStorage.getItem("jwtToken");

    if (!token) {
      setMessage({ type: "error", text: "You must be logged in to register." });
      return;
    }

    try {
      await axios.post(
        "http://localhost:8080/api/registrations",
        {
          eventId: id,
          teamMembers: teamMembers,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage({ type: "success", text: "Registration successful!" });
      setTeamMembers(teamMembers.map(() => ({ name: "", email: "", phone: "" })));

      setTimeout(() => navigate("/events"), 2000);
    } catch (error) {
      console.error("Registration error:", error);
      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Failed to register. Please try again.",
      });
    }
  };

  if (!event) {
    return (
      <Container sx={{ mt: 10 }}>
        <Typography variant="h5" color="error">
          Loading event...
        </Typography>
      </Container>
    );
  }

  return (
    <Box sx={{ backgroundColor: "#f4f4f4", minHeight: "100vh", py: 6 }}>
      <Container maxWidth="sm">
        <Paper elevation={4} sx={{ p: 4, borderRadius: 4 }}>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            Register for {event.title}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Team Size: {event.teamSize || 1}
          </Typography>

          {message.text && (
            <Alert severity={message.type} sx={{ mb: 2 }}>
              {message.text}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            {teamMembers.map((member, index) => (
              <Box key={index} sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Member {index + 1}
                </Typography>
                <TextField
                  fullWidth
                  label="Name"
                  value={member.name}
                  onChange={(e) => handleChange(index, "name", e.target.value)}
                  margin="normal"
                  required
                />
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={member.email}
                  onChange={(e) => handleChange(index, "email", e.target.value)}
                  margin="normal"
                  required
                />
                <TextField
                  fullWidth
                  label="Phone"
                  type="tel"
                  value={member.phone}
                  onChange={(e) => handleChange(index, "phone", e.target.value)}
                  margin="normal"
                  required
                />
                {index < teamMembers.length - 1 && <Divider sx={{ my: 2 }} />}
              </Box>
            ))}

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 3, py: 1.5 }}
            >
              Submit Registration
            </Button>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default EventRegistration;
