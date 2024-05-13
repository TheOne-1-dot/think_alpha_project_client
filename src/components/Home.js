import React from "react";
import { Button, Container, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <Container>
      <Typography variant="h4" sx={{ mt: 4, mb: 2 }}>
        Welcome to ThinkAlpha
      </Typography>
      <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
        <Button
          variant="contained"
          onClick={() => navigate("/tasks")}
          sx={{ width: "200px" }}
        >
          Manage Tasks
        </Button>
        <Button
          variant="contained"
          onClick={() => navigate("/groups")}
          sx={{ width: "200px" }}
        >
          Manage Groups
        </Button>
      </Box>
    </Container>
  );
}

export default Home;
