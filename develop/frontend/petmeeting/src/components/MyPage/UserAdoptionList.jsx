import axios from "axios";
import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

export default function UserAdoptionList({ shelterNo }) {
  const accessToken = JSON.parse(sessionStorage.getItem("token"))?.accessToken;
  const [isDetail, setIsDetail] = useState(false);
  const [adoptionList, setAdoptionList] = useState([]);

  useEffect(() => {
    axios.get("https://i9a203.p.ssafy.io/backapi/api/v1/adoption", {
      headers: {
        "AccessToken": "Bearer " + accessToken
      }
    }).then((response) => {
      console.log(response.data)
      setAdoptionList(response.data);
    });
  }, []);

  const getDogName = async (dogNo) => {
    try {
      const response = await axios.get(`https://i9a203.p.ssafy.io/backapi/api/v1/dog/${dogNo}`, {
        headers: {
          "AccessToken": "Bearer " + accessToken
        }
      });
      return response.data.name;
    } catch (error) {
      console.error("Error fetching dog name:", error);
      return "Unknown Dog";
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const updatedList = [];
      for (const adoption of adoptionList) {
        const dogName = await getDogName(adoption.dogNo);
        updatedList.push({ ...adoption, dogName });
      }
      setAdoptionList(updatedList);
    };
  
    fetchData();
  }, []); // 의존성 배열을 빈 배열로 설정하여 초기에만 실행되도록 합니다.

  useEffect(() => {
    const updateNames = async () => {
      const updatedList = await Promise.all(
        adoptionList.map(async (adoption) => {
          const dogName = await getDogName(adoption.dogNo);
          return { ...adoption, dogName };
        })
      );
      setAdoptionList(updatedList);
    };
    if (adoptionList.length > 0) {
      updateNames();
    }
  }, [adoptionList]);
  

  const handleAdopt = (adoptionNo) => {
    
  };

  return (
    <Box>
      {isDetail ? (
        // 입양신청 상세
        <Box></Box>
      ) : (
        // 입양신청목록
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>유기견이름</TableCell>
                <TableCell>신청자</TableCell>
                <TableCell>나이</TableCell>
                <TableCell>성별</TableCell>
                <TableCell>직업</TableCell>
                <TableCell>반려동물 경험</TableCell>
                <TableCell>지역</TableCell>
                <TableCell>연락처</TableCell>
                <TableCell>연락가능시간</TableCell>
                <TableCell>입양신청상태</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {adoptionList.map((adoption) => (
                <TableRow key={adoption.adoptionNo}>
                  <TableCell>{adoption.dogName}</TableCell>
                  <TableCell>{adoption.name}</TableCell>
                  <TableCell>{adoption.age}</TableCell>
                  <TableCell>{adoption.gender}</TableCell>
                  <TableCell>{adoption.job}</TableCell>
                  <TableCell>{adoption.petExperience ? <>있음</> : <>없음</>}</TableCell>
                  <TableCell>{adoption.residence}</TableCell>
                  <TableCell>{adoption.phoneNumber}</TableCell>
                  <TableCell>{adoption.callTime}</TableCell>
                  <TableCell>{adoption.adoptionStatus}</TableCell>
                  <TableCell>
                    {adoption.adoptionStatus === "대기중" && ( // 대기중 상태일 때만 버튼 활성화
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleAdopt(adoption.adoptionNo)}
                      >
                        채택
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
