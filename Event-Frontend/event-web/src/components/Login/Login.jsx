import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  InputAdornment,
  Paper,
  IconButton,
  Link as MuiLink,
  Snackbar,
  Alert,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import LoginIcon from "@mui/icons-material/Login";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Link, useNavigate } from "react-router-dom";
import Header from "../Header/Header";

const Login = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const validate = () => {
    let tempErrors = { email: "", password: "" };
    let isValid = true;

    if (!data.email) {
      tempErrors.email = "Email is required";
      isValid = false;
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(data.email)) {
      tempErrors.email = "Email is not valid";
      isValid = false;
    }

    if (!data.password) {
      tempErrors.password = "Password is required";
      isValid = false;
    } else if (data.password.length < 6) {
      tempErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleTogglePassword = () => setShowPassword((prev) => !prev);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") return;
    setOpenSnackbar(false);
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const responseText = await response.text();

      if (response.ok) {
        localStorage.setItem("jwtToken", responseText);
        setSnackbarMessage("Login successful!");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
        navigate("/");
      } else {
        setSnackbarMessage(responseText || "Login failed. Please try again.");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error("Error during login:", error);
      setSnackbarMessage("An error occurred during login. Please try again later.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  return (
    <>
      <Header />
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
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          px: 2,
          pt: 10,
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={10}
            sx={{
              p: 4,
              borderRadius: 3,
              width: "100%",
              maxWidth: 500,
              backgroundColor: "#ffffffdd",
              color: "#000",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.4)",
              backdropFilter: "blur(10px)",
              "&:hover": {
                transform: "scale(1.02)",
                boxShadow: "0px 12px 30px rgba(0, 0, 0, 0.5)",
              },
            }}
          >
            <Box textAlign="center" mb={2}>
              <Typography variant="h3" fontWeight={700} color="#800000">
                🔐
              </Typography>
              <Typography variant="h5" fontWeight={600} color="#800000">
                Welcome Back
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Please enter your login credentials
              </Typography>
            </Box>

            <Box component="form" noValidate onSubmit={onSubmitHandler}>
              <TextField
                label="Email Address"
                variant="outlined"
                type="email"
                name="email"
                fullWidth
                margin="normal"
                required
                value={data.email}
                onChange={onChangeHandler}
                error={!!errors.email}
                helperText={errors.email}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: "#800000" }} />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                label="Password"
                variant="outlined"
                type={showPassword ? "text" : "password"}
                name="password"
                fullWidth
                margin="normal"
                required
                value={data.password}
                onChange={onChangeHandler}
                error={!!errors.password}
                helperText={errors.password}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: "#800000" }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleTogglePassword}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Box textAlign="right" mt={1}>
                <MuiLink component={Link} to="/forgot-password" underline="hover">
                  Forgot Password?
                </MuiLink>
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{
                  mt: 3,
                  mb: 2,
                  height: 50,
                  borderRadius: "30px",
                  fontWeight: "bold",
                  textTransform: "none",
                  backgroundColor: "#800000",
                  "&:hover": {
                    backgroundColor: "#5a0000",
                  },
                }}
                startIcon={<LoginIcon />}
              >
                Sign In
              </Button>

              <Typography textAlign="center" variant="body2">
                Don't have an account?{" "}
                <MuiLink
                  component={Link}
                  to="/register"
                  underline="hover"
                  sx={{ color: "#800000" }}
                >
                  Sign Up
                </MuiLink>
              </Typography>
            </Box>
          </Paper>
        </Container>

        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbarSeverity}
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </>
  );
};

export default Login;