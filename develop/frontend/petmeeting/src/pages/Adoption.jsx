import React, { useEffect, useState } from "react";
import { Typography, Box } from "@mui/material";
import axios from "axios";
import { config } from "../static/config";
import DogListItem from "../components/Adoption/DogListItem";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import AdoptionBanner from "../assets/images/adoption_banner.jpg";
import { Link } from "react-router-dom";

export default function Adoption() {
  const [dogData, setDogData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(3);
  const [allDogs, setAllDogs] = useState([]);

  useEffect(() => {
    try {
      axios.get(`${config.baseURL}/api/v1/dog?option=all`).then((response) => {
        setAllDogs(response.data);
      });
    } catch (exception) {
      console.log(exception);
    }
  }, []);

  useEffect(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    setDogData(allDogs.slice(startIndex, endIndex));
  }, [allDogs, currentPage, pageSize]);

  return (
    <Box
      sx={{
        mt: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h1>입양하기</h1>
      {/* 입양하러가기 배너 */}
      <Link to="/adoption/form">
        <img src={AdoptionBanner} alt="AdoptionBanner" />
      </Link>

      {/* 입양신청서 목록 넣을 곳 */}
      <h1>입양 가능한 강아지</h1>
      {dogData.length > 0 ? (
        <>
          <Box display="flex" flexDirection="row" gap={2} flexWrap="wrap">
            {dogData.map((dog, index) => (
                <DogListItem dog={dog} index={index} key={dog.id} />
              ))}
          </Box> 
          {/* 페이지네이션 */}
          <Stack spacing={2} mt={2}>
            <Pagination
              count={Math.ceil(allDogs.length / pageSize)}
              page={currentPage}
              onChange={(event, newPage) => setCurrentPage(newPage)}
              color="primary"
            />
          </Stack>
        </>
      ) : (
        <>
          <Typography
            variant="h5"
            align="center"
            style={{
              marginTop: '20px',
              padding: '10px',
              borderRadius: '5px',
              border: '0px solid #e0e0e0',
              fontFamily: 'Jua'
            }}>
            입양 가능한 강아지가 없어요
          </Typography>
        </>
      )}

    </Box>
  );
}
