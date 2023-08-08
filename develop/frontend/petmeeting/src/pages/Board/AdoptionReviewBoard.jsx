import { Box, Typography, Grid, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add"
import React, { useEffect, useState } from "react";
import ReviewList from '../../components/Board/AdoptionReviewList';
import { setAdoptionReview } from "../../stores/Slices/AdoptionReviewSlice";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function AdoptionReviewBoard() {
  const dispatch = useDispatch();

  const adoptionReview = useSelector(state => state.adoptionReview.adoptionReview);

  const itemsPerPage = 9; // 한 페이지에 보여줄 아이템 개수

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(adoptionReview.length / itemsPerPage);

  useEffect(() => {
    try {
      axios.get(`https://i9a203.p.ssafy.io/backapi/api/v1/board`,
        {
          option: 'all'
        }).then(response => {
          dispatch(setAdoptionReview(response.data));
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
    <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h5" gutterBottom>
        입양후기
      </Typography>

      {/* 입양후기 작성 버튼 */}
      <Box sx={{
        display: "flex",
        justifyContent: "flex-end", // 오른쪽 정렬
        marginBottom: "10px", // 아래 여백 추가
        width: "96%"
      }}>
        <Link to={`/board/adoption-review/cr`}>
          <Button startIcon={<AddIcon />} color="primary" variant="outlined">
            입양후기 작성
          </Button>
        </Link>
      </Box>

      <Grid container spacing={1}>
        {/* 입양후기 리스트 */}
        <Grid container item spacing={2} sx={{ marginLeft: 2, marginRight: 2 }}>
          {adoptionReview.slice(startIndex, endIndex).map((board, idx) => (
            <Grid item key={idx} xs={12} sm={6} md={4}>
              {/* Link 컴포넌트를 사용하여 페이지 이동 */}
              <Link to={`/board/adoption-review/${board.boardNo}`}>
                <ReviewList board={board} />
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
