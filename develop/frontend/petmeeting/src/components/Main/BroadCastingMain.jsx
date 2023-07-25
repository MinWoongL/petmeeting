import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

function BroadCastingMain() {
  return (
    <Card>
      <Box display="flex" alignItems="center">
        <Box 
          flexGrow={1} 
          display="flex" 
          justifyContent="center" 
          alignItems="center"
          style={{ 
            width: '100%', 
            height: '300px', 
            backgroundColor: '#f0f0f0' 
          }}
        >
          <Typography variant="subtitle1" color="textSecondary">
            스트림 로딩중...
          </Typography>
        </Box>
        <CardContent>
          <Typography variant="h5">Live Preview</Typography>
        </CardContent>
      </Box>
    </Card>
  );
}

export default BroadCastingMain;
