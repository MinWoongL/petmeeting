import React, { useState } from "react";
import { Box, Typography, Button, TextField } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setAdoptionReview } from "../../stores/Slices/AdoptionReviewSlice";

export default function AdoptionReviewCreate() {
  const dispatch = useDispatch();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const accessToken = JSON.parse(sessionStorage.getItem("token")).accessToken;

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleContentChange = (event) => {
    setContent(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!title || !content) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }

    try {
      const response = await axios.post(
        "https://i9a203.p.ssafy.io/backapi/api/v1/board",
        {
          title: title,
          content: content,
        },
        {
          headers: {
            "AccessToken": "Bearer " + accessToken,
          },
        }
      );

      if (response.status === 201) {
        alert("게시글이 등록되었습니다.");
        setTitle("");
        setContent("");
        dispatch(setAdoptionReview(response.data));
      }
    } catch (error) {
      console.log("에러 발생: " + error);
    }
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
        입양후기 작성
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
              maxHeight: "200px",
              overflowY: "auto",
              padding: "10px 0 0 0",
            }}
          />

          {/* 게시 버튼 */}
          <Button
            type="submit"
            startIcon={<ArrowBackIcon />}
            color="primary"
            variant="outlined"
            sx={{ mt: 2 }}
          >
            게시
          </Button>
        </form>
      </Box>
    </Box>
  );
}
