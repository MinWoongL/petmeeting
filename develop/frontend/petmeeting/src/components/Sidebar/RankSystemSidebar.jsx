import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  Avatar,
  Paper,
} from "@mui/material";
import axios from "axios";
import { config } from "../../static/config";

function RankSide() {
  const [dogs, setDogs] = useState([]);
  const [currentTab, setCurrentTab] = useState(0);

  const fetchDogData = async () => {
    try {
      const response = await axios.get(
        `${config.baseURL}/api/v1/dog?option=rank&max=5`
      );
      const data = response.data; // Assuming the response contains an array of dog objects
      return data;
    } catch (error) {
      console.error("Error fetching dog data:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const fetchedData = await fetchDogData();
      setDogs(fetchedData);
    };
    fetchData();
  }, []);

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  let displayedDogs = dogs.slice(0, 4); // Display the top 4 liked dogs

  if (currentTab === 1) {
    const shuffledDogs = shuffleArray([...dogs]);
    displayedDogs = shuffledDogs.slice(0, 4); // Display the top 4 shuffled dogs
  }
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        mt: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        borderRadius: "8px",
      }}
    >
      <Typography
        component="h1"
        variant="h5"
        gutterBottom
        style={{ fontFamily: "Poor Story" }}
      >
        오늘의 인기 강아지
      </Typography>

      <Paper
        elevation={3}
        sx={{ width: "90%", overflowX: "auto", borderRadius: "0 0 4px 4px" }}
      >
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          centered
          sx={{
            marginBottom: "0px",
            borderBottom: "1px solid #e0e0e0",
            "& .Mui-selected": {
              color: "var(--dark)",
              fontWeight: "bold",
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "var(--yellow7)",
            },
            "& .MuiTab-root": {
              "&:hover": {
                backgroundColor: "var(--yellow8)", // Or any other hover effect you want
              },
            },
          }}
        >
          <Tab label="좋아요순" />
          <Tab label="랜덤순" />
        </Tabs>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>강아지</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>이름</TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                좋아요
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedDogs.map((dog, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Avatar
                    src={`https://i9a203.p.ssafy.io/backapi/api/v1/image/${dog.imagePath}?option=dog`}
                    alt={dog.name}
                    sx={{ width: 60, height: 60 }}
                  />
                </TableCell>
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
