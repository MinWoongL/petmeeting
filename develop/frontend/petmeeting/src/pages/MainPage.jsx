// src/components/Home.js
import React from 'react';
import BroadCastingMain from '../components/Main/BroadCastingMain';
import { Typography, Box } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';

function Home() {
  const message = useSelector(state => state.message.text)

  const dispatch = useDispatch()

  return (
    <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography component="h1" variant="h5">
        Home
      </Typography>
      <Box component="div" noValidate sx={{ mt: 1 }}>
        <Typography component="p">
          { message }
        </Typography> 
      </Box>
      <BroadCastingMain/>
    </Box>
  );
}

export default Home;
