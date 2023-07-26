import React from 'react';
import { Typography, Box } from '@mui/material';
// import { useSelector } from 'react-redux';

function Shelter() {
  // const message = useSelector(state => state.message)

  return (
    <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography component="h1" variant="h5">
        Home
      </Typography>
      <Box component="div" noValidate sx={{ mt: 1 }}>
        <Typography component="p">
          Welcome to the Shelter page!
        </Typography>
      </Box>
    </Box>
  );
}

export default Shelter;

// 보호소 상세 (상세페이지 컴포넌트)

// 메뉴바 (여기에 만들어져있는상태)

// 메뉴바상태에따라서 랭킹, 강아지목록 컴포넌트 호출