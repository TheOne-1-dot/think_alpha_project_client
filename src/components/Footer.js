import React from "react";
import { Typography, Container, Box } from "@mui/material";

function Footer() {
  return (
    <Box
      mt={8}
      py={3}
      style={{ backgroundColor: "#f5f5f5", textAlign: "center" }}
    >
      <Container maxWidth="lg">
        <Typography variant="body1">ThinkAlpha</Typography>
        <Typography variant="body2" color="textSecondary">
          © {new Date().getFullYear()} ThinkAlpha. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}

export default Footer;