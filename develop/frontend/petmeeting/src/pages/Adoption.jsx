
import React, { useEffect, useState } from 'react';
import { Typography, Box } from '@mui/material';
import axios from 'axios';
import { config } from '../static/config';
import DogListItem from '../components/Adoption/DogListItem';

export default function Adoption() {
  const [dogData, setDogData] = useState([]);

  useEffect(() => {
    try {
      axios.get(`${config.baseURL}/api/v1/dog?option=all`)
      .then((response) => {
        setDogData(response.data);
      })
    } catch (exception) {
      console.log(exception);
    }
  }, [])

  console.log(dogData)

  return (
    <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography component="h1" variant="h5">
        입양하기
      </Typography>
      {/* 배너 넣을 곳 */}
      <h1>배너 넣을 곳</h1>

      {/* 입양신청서 목록 넣을 곳 */}
      <h1>입양 가능한 강아지</h1>
      <Box display="flex" flexDirection="row" gap={2} flexWrap="wrap">
          {dogData.map((dog, index) => (
            <DogListItem dog={dog} index={index}/>
          ))}
        </Box>
    </Box>
  );
}