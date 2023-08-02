import React from 'react';
import { Box, Typography } from '@mui/material';
import BroadCastingView from '../components/BroadCasting/BroadCastingView';
import BroadCastingDetail from '../components/BroadCasting/BroadCastingDetail';

function BroadCasting() {
  return (
    <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography component="h1" variant="h5">
        BroadCasting Page
      </Typography>
      {/* 다른 컨텐츠와 컴포넌트들이 여기에 추가될 수 있습니다. */}
      <BroadCastingView/>
      <BroadCastingDetail />
    </Box>
    
  );
}

export default BroadCasting;
