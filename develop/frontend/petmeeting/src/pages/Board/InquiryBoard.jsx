import { Box, Typography, Grid, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setInquiry } from "../../stores/Slices/InquirySlice"; 
import axios from "axios";
import { Link } from "react-router-dom";
import InquiryList from '../../components/Board/InquiryList';


function InquiryBoard() {
  const dispatch = useDispatch();
  const inquiry = useSelector(state => state.inquiry.inquiry);
  
  const itemsPerPage = 10; 

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(inquiry.length / itemsPerPage);

  const accessToken = JSON.parse(sessionStorage.getItem("token"))?.accessToken;

  useEffect(() => {
    try {
      axios.get(`https://i9a203.p.ssafy.io/backapi/api/v1/inquiry`, 
      {
        params: {
            option: 'all'
          }
      },
      {
        headers: {
            "AccessToken": "Bearer " + accessToken
        }
      }).then(response => {
        console.log(response);
        dispatch(setInquiry(response.data)); 
      });
    } catch(error) {
      console.log("에러 발생 : " + error);
    }
  }, []);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  return (
    <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h5" gutterBottom>
        문의게시판
      </Typography>

      {/* 문의게시글 작성 버튼 */}
      <Box sx={{
        display: "flex",
        justifyContent: "flex-end", // 오른쪽 정렬
        marginBottom: "10px", // 아래 여백 추가
        width: "96%"
      }}>
        {accessToken ? (
          <Link to={`/board/inquiry/cr`}>
            <Button startIcon={<AddIcon />} color="primary" variant="outlined">
              문의게시글 작성
            </Button>
          </Link>
        ) : (
            <Box>

            </Box>
        )}
      </Box>

      <Grid container spacing={1}>
        {/* 문의게시판 리스트 */}
        <Grid container item spacing={2} sx={{ marginLeft: 2, marginRight: 2 }}>
          {inquiry.slice(startIndex, endIndex).map((board, idx) => (
            <Grid item key={idx} xs={12} sm={6} md={4}>
              {/* Link 컴포넌트를 사용하여 페이지 이동 */}
              <Link to={`/board/inquiry/${board.boardNo}`}>
                <InquiryList board={board} />
              </Link>
            </Grid>
          ))}
        </Grid>

        {/* 페이지네이션 */}
        <Grid container item justifyContent="center">
          <Button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>이전</Button>
          {Array.from({ length: totalPages }, (_, index) => (
            <Button key={index} onClick={() => handlePageChange(index + 1)}>{index + 1}</Button>
          ))}
          <Button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>다음</Button>
        </Grid>
      </Grid>
    </Box>
  )
}

export default InquiryBoard;