import React, { useState, useEffect } from 'react';
import { Typography, Box, Table, TableBody, TableCell, TableHead, TableRow, Tabs, Tab, Avatar, Paper } from '@mui/material';

function RankSide() {
  const [dogs, setDogs] = useState([]);
  const [currentTab, setCurrentTab] = useState(0);

  useEffect(() => {
    const fetchedDogs = [
      { name: 'Dog 1', likes: 5, image: 'https://www.animal.go.kr/front/fileMng/imageView.do?f=/files/shelter/2023/05/202307181707536.jpg' },
      { name: 'Dog 2', likes: 2, image: 'https://www.animal.go.kr/front/fileMng/imageView.do?f=/files/shelter/2023/07/202307251307624.jpg' },
      { name: 'Dog 3', likes: 8, image: 'https://www.animal.go.kr/front/fileMng/imageView.do?f=/files/shelter/2023/05/202307171707248.jpg' },
      { name: 'Dog 4', likes: 12, image: 'https://www.animal.go.kr/front/fileMng/imageView.do?f=/files/shelter/2023/07/202308010708549.jpg' },
    ];

    setDogs(fetchedDogs);
  }, []);

  const sortDogsByLikes = (dogs) => {
    return [...dogs].sort((a, b) => b.likes - a.likes);
  };

  const shuffleDogs = (dogs) => {
    for (let i = dogs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [dogs[i], dogs[j]] = [dogs[j], dogs[i]];
    }
    return dogs;
  };

  const displayedDogs = currentTab === 0 ? sortDogsByLikes(dogs) : shuffleDogs(dogs);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <Box sx={{ width: '100%', height: '100%', mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius:'8px' }}>
      <Typography component="h1" variant="h5" gutterBottom style={{ fontFamily: 'Poor Story' }}>
        오늘의 인기 강아지
      </Typography>

      <Paper elevation={3} sx={{ width: '90%', overflowX: 'auto', borderRadius: '0 0 4px 4px' }}>
      <Tabs
      value={currentTab}
      onChange={handleTabChange}
      centered
      sx={{
        marginBottom: '0px',
        borderBottom: '1px solid #e0e0e0',
        '& .Mui-selected': {
          color: 'var(--dark)',
          fontWeight: 'bold',
        },
        '& .MuiTabs-indicator': {
          backgroundColor: 'var(--yellow7)',
        },
        '& .MuiTab-root': {
          '&:hover': {
            backgroundColor: 'var(--yellow8)'  // Or any other hover effect you want
          },
        }
      }}
    >
      <Tab label="좋아요순" />
      <Tab label="랜덤순" />
    </Tabs>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>강아지</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>이름</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>좋아요</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedDogs.map((dog, index) => (
              <TableRow key={index}>
                <TableCell><Avatar src={dog.image} alt={dog.name} sx={{ width: 60, height: 60 }} /></TableCell>
                <TableCell>{dog.name}</TableCell>
                <TableCell align="right">{dog.likes}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}

export default RankSide;
