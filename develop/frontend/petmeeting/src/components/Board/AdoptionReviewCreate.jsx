import React, { useState } from "react";
import { Box, Typography, Button, TextField } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Link } from "react-router-dom"; // 추가
import axios from "axios";
import { useDispatch } from "react-redux";
import { setAdoptionReview } from "../../stores/Slices/AdoptionReviewSlice";
import imageUploadButton from "../Button/ImageUploadButton";

export default function AdoptionReviewCreate() {
  const dispatch = useDispatch();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState(""); // 선택한 파일명 상태

  const accessToken = JSON.parse(sessionStorage.getItem("token"))?.accessToken;

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleContentChange = (event) => {
    setContent(event.target.value);
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!window.confirm("게시글을 등록하시겠습니까?")) return;

    if (!title || !content) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }

    try {
      let imagePath = null; // default image 경로 넣어주면 좋을 듯

      if (selectedFile) {
        const formData = new FormData();
        formData.append("image", selectedFile);

        await axios
          .post(
            "https://i9a203.p.ssafy.io/backapi/api/v1/image?option=board",
            formData,
            {
              headers: {
                AccessToken: "Bearer " + accessToken,
                "Content-Type": "multipart/form-data",
              },
            }
          )
          .then((response) => {
            imagePath = response.data;
          });
      }

      await axios
        .post(
          "https://i9a203.p.ssafy.io/backapi/api/v1/board",
          {
            title: title,
            content: content,
            imagePath: imagePath,
          },
          {
            headers: {
              AccessToken: "Bearer " + accessToken,
            },
          }
        )
        .then((response) => {
          window.location.href =
            "/board/adoption-review/" + response.data.boardNo;
        });
    } catch (error) {
      console.log("에러 발생: " + error);
    }
  };

  const handleCancel = () => {
    setTitle("");
    setContent("");
    setSelectedFile(null);
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
            inputProps={{
              maxLength: 60,
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
            <input
              type="file"
              accept=".jpg, .jpeg, .png, .gif"
              onChange={handleFileChange}
              style={{
                display: "none",
              }}
              id="image-upload-input"
            />

            <label htmlFor="image-upload-input">
              <Button
                component="span"
                variant="contained"
                color="primary"
                sx={{
                  mt: 2,
                  fontWeight: "bold",
                  fontSize: "14px",
                }}
              >
                이미지 업로드
              </Button>
            </label>

            {selectedFileName && ( // 파일명이 있을 때만 표시
              <p>선택한 파일: {selectedFileName}</p>
            )}

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
                to="/board/adoption-review" // 목록 페이지 경로 설정
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
