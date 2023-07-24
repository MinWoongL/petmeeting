// src/components/About.js
import React from 'react';
import { Typography, Box } from '@mui/material';

function About() {
  return (
    <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography component="h1" variant="h5">
        About
      </Typography>
      <Box component="div" noValidate sx={{ mt: 1 }}>
        <Typography component="p">
          This is the about page!
        </Typography>
      </Box>
    </Box>
  );
}

export default About;
