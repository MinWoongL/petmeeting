// src/components/MainPage.js
import React from 'react';
import BroadCastingMain from '../components/Main/BroadCastingMain';
import BroadCastingSub from '../components/Main/BroadCastingSub';
import AdoptionReview from '../components/Main/AdoptionReview'
import { Typography, Box } from '@mui/material';

function MainPage() {

  return (
    <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography component="h1" variant="h5">
        Home
      </Typography>
      <Box component="div" noValidate sx={{ mt: 1 }}>
        <Typography component="p">
          
        </Typography> 
      </Box>
      {/* 방송중메인영역 */}
      <BroadCastingMain/>
      {/* <div><br /><br /><br /><br /></div> */}
      {/* sub방송중페이지영역 */}
      <BroadCastingSub/>
      {/* 입양후기페이지영역 */}
      <AdoptionReview/>
      
    </Box>
  );
}

export default MainPage;
