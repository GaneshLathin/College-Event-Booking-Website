import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Container,
  Paper,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../service/authService";
import Header from "../Header/Header";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const isLoggedIn = !!localStorage.getItem("jwtToken");
  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setIsError(false);

    try {
      const response = await authService.forgotPassword(email);
      setMessage(response);
      setIsError(false);
      navigate("/reset-password", { state: { email } });
    } catch (error) {
      setMessage(error || "Failed to send OTP. Please try again.");
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        backgroundImage:` url(${require("../../assests/image2.jpg")})`,
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

      <Container sx={{ pt: 12, pb: 8 }}>
        {/* Increased top padding here from pt: 8 to pt: 12 */}
        <Typography
          variant="h3"
          textAlign="center"
          fontWeight={700}
          gutterBottom
        >
          🔐 Forgot Password
        </Typography>

        <Paper
          elevation={12}
          sx={{
            width: "500px",
            mx: "auto",
            mt: 4, // Move the paper slightly lower too
            p: 5,
            borderRadius: 4,
            backgroundColor: "#ffffffdd",
            color: "#000",
            boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.4)",
            backdropFilter: "blur(10px)",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            "&:hover": {
              transform: "scale(1.02)",
              boxShadow: "0px 12px 30px rgba(0, 0, 0, 0.5)",
            },
          }}
        >
          <Typography variant="h5" align="center" gutterBottom>
            Enter your email to receive an OTP
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              label="Email address"
              type="email"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                backgroundColor: "#800000",
                color: "#fff",
                fontWeight: "bold",
                borderRadius: 2,
                py: 1.2,
                fontSize: "1rem",
                "&:hover": {
                  backgroundColor: "#5a0000",
                },
                mt: 2,
              }}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: "#fff" }} />
              ) : (
                "Send OTP"
              )}
            </Button>
          </form>

          {message && (
            <Alert severity={isError ? "error" : "success"} sx={{ mt: 2 }}>
              {message}
            </Alert>
          )}

          <Typography align="center" sx={{ mt: 3 }}>
            Remember your password?{" "}
            <Link to="/login" style={{ color: "#3f51b5" }}>
              Login here
            </Link>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default ForgotPassword;