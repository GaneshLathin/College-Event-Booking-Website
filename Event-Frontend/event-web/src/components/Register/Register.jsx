import React, { useState } from "react";
import {
  Box,
  Container,
  Grid,
  TextField,
  Typography,
  Button,
  Paper,
  InputAdornment,
  IconButton,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  OutlinedInput,
  Chip,
} from "@mui/material";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import PersonIcon from "@mui/icons-material/Person";
import Header from "../Header/Header";
import authService from "../../service/authService";

// ✅ Predefined interest categories
const interestsList = [
  "Online Events",
  "Gaming",
  "Dance",
  "Music",
  "Quiz",
  "Creative Arts",
  "Performing Arts",
  "Theater Arts",
];

const Register = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("jwtToken"));

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    interests: [], // ✅ NEW FIELD
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleInterestChange = (event) => {
    const { value } = event.target;
    setFormData((prev) => ({
      ...prev,
      interests: typeof value === "string" ? value.split(",") : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, password, confirmPassword, interests } = formData;

    if (!name || !email || !password || !confirmPassword) {
      toast.error("All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (interests.length === 0) {
      toast.error("Please select at least one interest.");
      return;
    }

    setLoading(true);
    try {
      const response = await authService.registerUser(formData);
      if (response === "User registered successfully!") {
        toast.success("🎉 Registration successful! Please login.");
        navigate("/login");
      } else {
        toast.warn(response);
      }
    } catch (err) {
      toast.error(err?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    setIsLoggedIn(false);
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

      <Container sx={{ py: 8 }}>
        <Typography
          variant="h3"
          textAlign="center"
          fontWeight={700}
          gutterBottom
        >
          📝 Create Account
        </Typography>

        <Grid container justifyContent="center">
          <Grid item xs={12} md={10} lg={6}>
            <Paper
              elevation={12}
              sx={{
                width: "500px",
                mx: "auto",
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
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2} direction="column">
                  <Grid item xs={12}>
                    <TextField
                      name="name"
                      label="Full Name"
                      fullWidth
                      required
                      variant="outlined"
                      value={formData.name}
                      onChange={handleChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      name="email"
                      label="Email Address"
                      fullWidth
                      required
                      variant="outlined"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      name="password"
                      label="Password"
                      fullWidth
                      required
                      variant="outlined"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword((prev) => !prev)}
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      name="confirmPassword"
                      label="Confirm Password"
                      fullWidth
                      required
                      variant="outlined"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() =>
                                setShowConfirmPassword((prev) => !prev)
                              }
                            >
                              {showConfirmPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  {/* ✅ Interests Multi-Select */}
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel id="interests-label">Select Interests</InputLabel>
                      <Select
                        labelId="interests-label"
                        multiple
                        value={formData.interests}
                        onChange={handleInterestChange}
                        input={<OutlinedInput label="Select Interests" />}
                        renderValue={(selected) => (
                          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                            {selected.map((value) => (
                              <Chip key={value} label={value} />
                            ))}
                          </Box>
                        )}
                      >
                        {interestsList.map((interest) => (
                          <MenuItem key={interest} value={interest}>
                            {interest}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
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
                      }}
                    >
                      {loading ? (
                        <CircularProgress size={24} sx={{ color: "#fff" }} />
                      ) : (
                        "Register"
                      )}
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography textAlign="center">
                      Already have an account?{" "}
                      <Link
                        to="/login"
                        style={{ fontWeight: "bold", color: "#1976d2" }}
                      >
                        Login here
                      </Link>
                    </Typography>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Register;
