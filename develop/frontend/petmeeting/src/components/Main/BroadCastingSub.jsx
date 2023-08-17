import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardMedia, Avatar, Typography, IconButton, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // useNavigate 사용
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import broadcastIcon from './BroadcastIcon.png';
import axios from 'axios';

function BroadCastingSub() {
  const [startIndex, setStartIndex] = useState(0);
  const itemsToShow = 3;
  const [shelterData, setShelterData] = useState([]);
  const navigate = useNavigate(); // useNavigate 사용

  useEffect(() => {
    axios
      .get('https://i9a203.p.ssafy.io/backapi/api/v1/shelter?option=all')
      .then((response) => {
        setShelterData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handlePrev = () => {
    if (startIndex === 0) {
      setStartIndex(shelterData.length - 1);
    } else {
      setStartIndex(startIndex - 1);
    }
  };

  const handleNext = () => {
    if (startIndex === shelterData.length - 1) {
      setStartIndex(0);
    } else {
      setStartIndex(startIndex + 1);
    }
  };

  const handleCardClick = (shelterNo) => {
    navigate(`/shelter/${shelterNo}`); // navigate 함수 사용
    window.scrollTo(0, 0);
  };

  const getVisibleCards = () => {
    const visibleCards = [...shelterData];
    const remainingSpace = itemsToShow - visibleCards.length % itemsToShow;

    for (let i = 0; i < remainingSpace; i++) {
      visibleCards.push(...shelterData);
    }

    const startIndexInList = startIndex % shelterData.length;
    return visibleCards.slice(startIndexInList, startIndexInList + itemsToShow);
  };

  return (
    <Box sx={{ mt: 3 }}>
      <span style={{ display: "flex", alignItems: "center" }}>
        <img
          src={broadcastIcon}
          alt="보호소 방송국"
          style={{ maxHeight: "39px" }}
        />
        <IconButton
          variant="contained"
          style={{
            backgroundColor: 'var(--yellow1)',
            marginBottom: '10px',
            marginLeft: '20px',
          }}
          onClick={handlePrev}
        >
          <ChevronLeftIcon />
        </IconButton>
        <IconButton
          variant="contained"
          style={{
            backgroundColor: 'var(--yellow1)',
            marginBottom: '10px',
            marginLeft: '10px',
          }}
          onClick={handleNext}
        >
          <ChevronRightIcon />
        </IconButton>
      </span>
      <Box display="flex" flexDirection="row" gap={2} flexWrap="wrap">
        {getVisibleCards().map((card, index) => (
          <Card
            key={index}
            style={{ width: 300, cursor: 'pointer', }}
            onClick={() => handleCardClick(card.shelterNo)}
          >
            <CardMedia
              component="img"
              height="160"
              image={`https://i9a203.p.ssafy.io/backapi/api/v1/image/${card.imagePath}?option=shelter`}
              alt={card.name}
            />
            <Box display="flex" alignItems="center" sx={{ p: 2 }}>
              <Avatar src={`https://i9a203.p.ssafy.io/backapi/api/v1/image/${card.imagePath}?option=shelter`} alt={card.name} />
              <Box sx={{ ml: 3, height: 45 }}>
                <Typography variant="h6" style={{ fontFamily: 'Jua', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                  {card.name}
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  style={{ fontFamily: 'Poor Story', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}
                >
                  {card.location}
                </Typography>
              </Box>
            </Box>
          </Card>
        ))}
      </Box>
    </Box>
  );
}

export default BroadCastingSub;
