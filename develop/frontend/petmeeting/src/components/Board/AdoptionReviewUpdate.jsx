import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Box, Typography, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FavoriteIcon from "@mui/icons-material/Favorite";
import axios from "axios";

export default function AdoptionReviewUpdate() {
  const { boardNo } = useParams();
  const userNo = JSON.parse(localStorage.getItem("user")).userNo;

  const [selectedReview, setSelectedReview] = useState(null);
  const [isLiked, setIsLiked] = useState(false);

  const accessToken = JSON.parse(sessionStorage.getItem("token")).accessToken;

  useEffect(() => {
    // 게시글 정보 가져오기
    axios.get(`https://i9a203.p.ssafy.io/backapi/api/v1/board/` + boardNo)
      .then((response) => {
        setSelectedReview(response.data);
      });

    // 좋아요 체크
    axios.get(`https://i9a203.p.ssafy.io/backapi/api/v1/board/like/` + boardNo,
      {
        headers: {
          "AccessToken": "Bearer " + accessToken
        }
      })
      .then(response => {
        setIsLiked(response.data.result);
      })
  }, []);

  if (!selectedReview) {
    return <div>게시글을 찾을 수 없습니다.</div>;
  }

  // 수정되었으면 수정 시간, 그렇지 않으면 작성 시간으로 설정
  const imagePath =
    `https://i9a203.p.ssafy.io/backapi/api/v1/image/` +
    selectedReview.imagePath +
    "?option=board";
  let date =
    "작성 시간 : " + formatDateTime(selectedReview.createdTime * 1000);

  if (selectedReview.updatedTime) {
    date = "수정 시간 : " + formatDateTime(selectedReview.updatedTime * 1000);
  }

  // 로그인된 사용자와 게시물 작성자를 비교하여 수정 및 삭제 버튼을 표시 여부 결정
  const isEditable = userNo === selectedReview.userNo;

  return (
    <Box
      sx={{
        mt: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginBottom: "30px"
      }}
    >
      <Typography variant="h5" gutterBottom>
        입양후기 수정하기
      </Typography>

      <Box
        sx={{
          border: "1px solid black",
          padding: "10px",
          borderRadius: "10px",
          width: "80%",
          maxWidth: "800px",
        }}
      >
        {/* 제목과 조회수 */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" gutterBottom>
            {selectedReview.title}
          </Typography>
          <Typography variant="body2">
            조회수: {selectedReview.viewCnt}
          </Typography>
        </Box>

        {/* 사진 */}
        <img
          src={imagePath}
          alt="게시글 이미지"
          style={{ width: "100%", maxHeight: "400px", objectFit: "cover" }}
        />

        {/* 생성날짜와 좋아요 개수 */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 1,
          }}
        >
          <Typography variant="body2">{date}</Typography>
          {selectedReview.likeCnt === 0 && (
            <Typography variant="body2">
              첫 좋아요를 눌러주세요
            </Typography>
          )}
          {selectedReview.likeCnt !== 0 && (
            <Typography variant="body2">
              좋아요 {selectedReview.likeCnt}개
            </Typography>
          )}
        </Box>

        {/* 좋아요 버튼 */}
        {!isLiked && (
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
            <Button onClick={() => likeBoard(boardNo)} startIcon={<FavoriteIcon />} color="primary" variant="outlined">
              좋아요
            </Button>
          </Box>
        )}
        {isLiked && (
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
            <Button onClick={() => dislikeBoard(boardNo)} startIcon={<FavoriteIcon />} color="error" variant="outlined">
              좋아요 취소
            </Button>
          </Box>
        )}

        {/* 내용 */}
        <Box sx={{ mt: 2, maxHeight: "100px", overflowY: "auto" }}>
          <Typography variant="body1" sx={{ wordWrap: "break-word" }}>
            {selectedReview.content}
          </Typography>
        </Box>

        {/* 수정 및 삭제 버튼 */}
        {isEditable && (
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Button
              startIcon={<EditIcon />}
              color="primary"
              variant="outlined"
              sx={{ mr: 1 }}
            >
              수정
            </Button>
            <Button startIcon={<DeleteIcon />} color="error" variant="outlined">
              삭제
            </Button>
          </Box>
        )}

        {/* 목록으로 가기 버튼 */}
        <Button
          component="a"
          href="/board/adoption-review"
          startIcon={<ArrowBackIcon />}
          color="inherit"
          sx={{ mt: 2 }}
        >
          목록으로 가기
        </Button>
      </Box>
    </Box>
  );
  function likeBoard(boardNo) {
    axios.post("https://i9a203.p.ssafy.io/backapi/api/v1/board/like/" + boardNo,
      {},
      {
        headers: {
          "AccessToken": "Bearer " + accessToken
        }
      }).then((response) => {
        console.log(response.data.msg);
        setIsLiked(true);
        selectedReview.likeCnt++;
      })
  }

  function dislikeBoard(boardNo) {
    axios.delete("https://i9a203.p.ssafy.io/backapi/api/v1/board/like/" + boardNo,
      {
        headers: {
          "AccessToken": "Bearer " + accessToken
        }
      }).then((response) => {
        console.log(response.data.msg);
        setIsLiked(false);
        selectedReview.likeCnt--;
      })
  }

  function formatDateTime(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
    const amPm = date.getHours() >= 12 ? "오후" : "오전";
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${year}. ${month}. ${day}. ${amPm} ${hours}:${minutes}`;
  }
}
