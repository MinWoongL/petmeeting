import { Box, Typography, Grid, Button, Paper } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setInquiry } from "../../stores/Slices/InquirySlice";
import axios from "axios";
import { Link } from "react-router-dom";
import InquiryList from "../../components/Board/InquiryList";
import AddIcon from "@mui/icons-material/Add";

function InquiryBoard() {
  const dispatch = useDispatch();
  const inquiry = useSelector((state) => state.inquiry.inquiry);

  const itemsPerPage = 10;

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(inquiry.length / itemsPerPage);

  const accessToken = JSON.parse(sessionStorage.getItem("token"))?.accessToken;

  useEffect(() => {
    try {
      axios
        .get(
          `https://i9a203.p.ssafy.io/backapi/api/v1/inquiry`,
          {
            params: {
              option: "all",
            },
          },
          {
            headers: {
              AccessToken: "Bearer " + accessToken,
            },
          }
        )
        .then((response) => {
          console.log(response);
          dispatch(setInquiry(response.data));
        });
    } catch (error) {
      console.log("에러 발생 : " + error);
    }
  }, []);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  return (
    <Box
      sx={{
        mt: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h1>문의게시판</h1>

      {/* 문의게시글 작성 버튼 */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end", // 오른쪽 정렬
          marginBottom: "10px", // 아래 여백 추가
          width: "65%",
        }}
      >
        {accessToken ? (
          <Link to={`/board/inquiry/cr`}>
            <Button startIcon={<AddIcon />} color="primary" variant="outlined"
              style={{
                fontWeight: "bold",
                color: "var(--yellow8)",
                border: "1px solid var(--yellow8)",
                marginTop: "15px"
              }}>
              문의게시글 작성
            </Button>
          </Link>
        ) : (
          <Box></Box>
        )}
      </Box>

      {inquiry.length > 0 ? (
        <Grid container spacing={2}>
          {/* 문의게시판 리스트 */}
          <Grid container item xs={12} justifyContent="center">
            {inquiry.slice(startIndex, endIndex).map((inquiry, idx) => (
              <Grid item key={idx} xs={12} md={8}>
                <Link to={`/board/inquiry/${inquiry.inquiryNo}`} style={{ textDecoration: "none" }}>
                  <Paper elevation={3} sx={{ p: 2, cursor: "pointer" }} style={{backgroundColor: "var(--yellow5)", marginTop: "25px"}}>
                    <InquiryList inquiry={inquiry} />
                  </Paper>
                </Link>
              </Grid>
            ))}
          </Grid>
          {/* 페이지네이션 */}
          <Grid container item justifyContent="center" style={{marginTop: "15px"}}>
            <Button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              style={{ color: "var(--yellow8)" }}
            >
              이전
            </Button>
            {Array.from({ length: totalPages }, (_, index) => (
              <Button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                style={{ color: "var(--yellow8)", fontWeight: "bolder" }}
              >
                {index + 1}
              </Button>
            ))}
            <Button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              style={{ color: "var(--yellow8)" }}
            >
              다음
            </Button>
          </Grid>
        </Grid>
      ) : (
        <Typography
          variant="body2"
          sx={{
            color: "grey",
            textAlign: "center",
            mt: 4,
            width: "100%",
            fontSize: "20px",
          }}
        >
          아직 작성된 문의게시글이 없습니다.
        </Typography>
      )}
    </Box>
  );
}

export default InquiryBoard;
