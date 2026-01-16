import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
} from "@mui/material";
import Header from "../Header/Header";

const previousEvents = [
  {
    title: "PONGAL CELEBRATION",
    description:
    "The Pongal Celebration was a blast!",
    postUrl: "https://www.instagram.com/reel/C2H2p_MN7yE/?igsh=eDUxNGk2YTc0ejcy",
  },
  {
    title: "CHRISTMAS CELEBRATION",
    description:
      "Little hands, big dreams, and a whole lot of love.",
    postUrl: "https://www.instagram.com/reel/C1L9xWISVSK/?igsh=Y2xma2oxc2RrbXly",
  },
  {
    title: "KRIZEN",
    description:"The crowd and festive cheer were amazing!",
    postUrl: "https://www.instagram.com/reel/CSCDQxeBIyS/?igsh=MW85YTR4M281NWJ4ag==",
  },
];

const About = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://www.instagram.com/embed.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

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

      {/* Hero Section */}
      <Box
        sx={{
          height: "60vh",
          backgroundColor: "rgba(0,0,0,0.6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          px: 2,
        }}
      >
        <Box>
          <Typography variant="h3" fontWeight={700}>
            About SRI KRISHNA INSTITUTIONS 
          </Typography>
          <Typography variant="h6" mt={2}>
            Where Education Meets Celebration & Innovation
          </Typography>
        </Box>
      </Box>

      {/* About Description */}
      <Container sx={{ py: 6 }}>
        <Paper
          elevation={3}
          sx={{ p: 4, borderRadius: 3, backgroundColor: "#fff", color: "#000" }}
        >
          <Typography variant="h5" fontWeight={600} gutterBottom>
            SRI KRISHNA COLLEGE OF ENGINEERING AND TECHNOLOGY🎓
          </Typography>
          <Typography variant="body1" color="text.secondary">
           Sri Krishna College of Engineering and Technology fosters a vibrant campus life that blends academics with creativity, culture, and community engagement. From dynamic student clubs and colorful festivals to sports, and social outreach, campus life is designed to enrich the student experience beyond the classroom. With modern amenities, supportive faculty, and countless opportunities for growth, SKCET encourages every student to explore their passions, build leadership skills, and create lasting memories.
          </Typography>
        </Paper>
      </Container>

      {/* Previous Events Section */}
      <Container sx={{ py: 6 }}>
        <Typography variant="h4" fontWeight={600} textAlign="center" mb={4}>
          Previous Events
        </Typography>
        <Grid container spacing={4} direction="column" alignItems="center">
          {previousEvents.map((event, idx) => (
            <Grid item key={idx} sx={{ width: "100%" }}>
              <Paper
                elevation={3}
                sx={{
                  p: 4,
                  borderRadius: 3,
                  backgroundColor: "#fff",
                  color: "#000",
                  width: "100%",
                  maxWidth: "900px",
                  minHeight: "380px",
                  margin: "0 auto",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Typography variant="h6" fontWeight={600} mb={2} textAlign="center">
                  {event.title}
                </Typography>

                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <blockquote
                    className="instagram-media"
                    data-instgrm-permalink={event.postUrl}
                    data-instgrm-version="14"
                    style={{
                      width: "100%",
                      maxWidth: "500px",
                      margin: "0 auto",
                      border: "none",
                    }}
                  ></blockquote>
                </Box>

                <Typography variant="body1" mt={2} textAlign="center">
                  {event.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default About;