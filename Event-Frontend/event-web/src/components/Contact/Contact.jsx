import React, { useState } from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Link,
} from "@mui/material";
import { toast } from "react-toastify";
import Header from "../Header/Header";

const Contact = () => {
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("jwtToken"));

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    setIsLoggedIn(false);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const form = event.target;
    const formData = new FormData(form);
    formData.append("access_key", ""); // Replace with your access key

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setLoading(false);

      if (data.success) {
        toast.success("Form submitted successfully!");
        form.reset();
      } else {
        toast.error(data.message || "Something went wrong, please try again.");
      }
    } catch (error) {
      setLoading(false);
      toast.error("Network error: Could not send form.");
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

      <Container sx={{ py: 8 }}>
        <Typography
          variant="h3"
          textAlign="center"
          fontWeight={700}
          gutterBottom
        >
          📬 Get in Touch
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
              <form onSubmit={onSubmit}>
                <Grid container spacing={2} direction="column">
                  <Grid item xs={12}>
                    <TextField
                      name="firstName"
                      label="First Name"
                      fullWidth
                      variant="outlined"
                      required
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      name="lastName"
                      label="Last Name"
                      fullWidth
                      variant="outlined"
                      required
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      name="email"
                      label="Email Address"
                      type="email"
                      fullWidth
                      variant="outlined"
                      required
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      name="message"
                      label="Your Message"
                      multiline
                      rows={4}
                      fullWidth
                      variant="outlined"
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      disabled={loading}
                      sx={{
                        backgroundColor: "#800000", // Maroon
                        color: "#fff",
                        fontWeight: "bold",
                        borderRadius: 2,
                        py: 1.2,
                        fontSize: "1rem",
                        "&:hover": {
                          backgroundColor: "#5a0000", // Darker maroon
                        },
                      }}
                    >
                      {loading ? (
                        <CircularProgress size={24} sx={{ color: "#fff" }} />
                      ) : (
                        <>
                          <i className="bi bi-send-fill" style={{ marginRight: "8px" }}></i>
                          Send Message
                        </>
                      )}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>

            {/* Social Media Section */}
            <Box mt={4} textAlign="center">
              <Typography variant="h6" sx={{ mt: 3, mb: 1, color: "#fff" }}>
                🔗 Connect with us:
              </Typography>
              <Box display="flex" justifyContent="center" gap={3}>
                <Link
                  href="https://www.instagram.com/skcetofficial?igsh=MWtxb203czA4bTVrOQ=="
                  target="_blank"
                  rel="noopener"
                  underline="none"
                  sx={{
                    color: "#E1306C",
                    fontWeight: "bold",
                    fontSize: "1rem",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  skcet@insta
                </Link>
                <Link
                  href="https://skcet.ac.in/"
                  target="_blank"
                  rel="noopener"
                  underline="none"
                  sx={{
                    color: "#1DA1F2",
                    fontWeight: "bold",
                    fontSize: "1rem",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  skcet.com
                </Link>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Contact;