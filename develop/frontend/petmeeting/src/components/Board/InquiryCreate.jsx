import React, { useState } from "react";
import { Box, Typography, Button, TextField } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Link } from "react-router-dom"; // 추가
import axios from "axios";
import { useDispatch } from "react-redux";
import { setInquiry } from "../../stores/Slices/InquirySlice";

export default function InquiryCreate() {
  const dispatch = useDispatch();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const accessToken = JSON.parse(sessionStorage.getItem("token"))?.accessToken;

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleContentChange = (event) => {
    setContent(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!window.confirm("게시글을 등록하시겠습니까?")) return;

    if (!title || title.trim() === "") {
      alert("제목을 입력해주세요.");
      return;
    }
    if (!content || content.trim() === "") {
      alert("내용을 입력해주세요.");
      return;
    }

    try {
      await axios
        .post(
          "https://i9a203.p.ssafy.io/backapi/api/v1/inquiry",
          {
            title: title,
            content: content,
          },
          {
            headers: {
              AccessToken: "Bearer " + accessToken,
            },
          }
        )
        .then((response) => {
          window.location.href = "/board/inquiry/" + response.data.inquiryNo;
        });
    } catch (error) {
      console.log("에러 발생: " + error);
    }
  };

  const handleCancel = () => {
    setTitle("");
    setContent("");
  };

  return (
    <Box
      sx={{
        mt: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginBottom: "30px",
      }}
    >
      <Typography variant="h5" gutterBottom>
        문의게시글 작성
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
        <form onSubmit={handleSubmit}>
          {/* 제목 */}
          <TextField
            fullWidth
            label="제목"
            value={title}
            onChange={handleTitleChange}
            sx={{ marginBottom: "16px" }}
            inputProps={{
              maxLength: 50,
            }}
          />

          {/* 내용 */}
          <TextField
            fullWidth
            multiline
            label="내용"
            value={content}
            onChange={handleContentChange}
            sx={{
              wordWrap: "break-word",
              maxHeight: "400px",
              overflowY: "auto",
              margin: "20px 0 20px 0",
            }}
          />
          {/* 버튼들 모음 */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between", // 버튼들을 양 끝에 배치
              alignItems: "center", // 세로 중앙 정렬
              marginBottom: "16px", // 아래 여백 추가
            }}
          >
            {/* 게시 및 취소 버튼 */}
            <Box>
              <Button
                type="submit"
                startIcon={<ArrowBackIcon />}
                color="primary"
                variant="outlined"
                sx={{ mr: 2 }}
              >
                게시
              </Button>
              <Button
                component={Link} // Link 컴포넌트로 변경
                to="/board/inquiry" // 목록 페이지 경로 설정
                startIcon={<ArrowBackIcon />}
                color="secondary"
                variant="outlined"
                onClick={handleCancel}
              >
                취소
              </Button>
            </Box>
          </Box>
        </form>
      </Box>
    </Box>
  );
}
