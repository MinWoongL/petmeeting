
import React from 'react';
import { Typography, Box } from '@mui/material';
// import { useSelector } from 'react-redux';

function Adoption() {
  // const message = useSelector(state => state.message)

  return (
    <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography component="h1" variant="h5">
        Home
      </Typography>
      <Box component="div" noValidate sx={{ mt: 1 }}>
        <Typography component="p">
          Welcome to the Adoption page!
        </Typography>
      </Box>
    </Box>
  );
}

export default Adoption;
