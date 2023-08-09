import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, Button, TextField, Input } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FavoriteIcon from "@mui/icons-material/Favorite";
import axios from "axios";

export default function InquiryMain() {
  const { inquiryNo } = useParams();
  const userNo = JSON.parse(localStorage.getItem("user"))?.userNo;

  const [selectedInquiry, setSelectedInquiry] = useState(null);

  const accessToken = JSON.parse(sessionStorage.getItem("token"))?.accessToken;

  // 문의게시글 수정을 위한 값
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const [editedDate, setEditedDate] = useState(null);

  useEffect(() => {
    // 게시글 정보 가져오기
    axios.get(`https://i9a203.p.ssafy.io/backapi/api/v1/inquiry/` + inquiryNo)
      .then((response) => {
        setSelectedInquiry(response.data);
        setEditedTitle(response.data.title);
        setEditedContent(response.data.content);
      });
    }, inquiryNo);

  if (!selectedInquiry) {
    return <div>게시글을 찾을 수 없습니다.</div>;
  }

  // 수정되었으면 수정 시간, 그렇지 않으면 작성 시간으로 설정
  let date =
    "작성 시간 : " + formatDateTime(selectedInquiry.createdTime * 1000);

  if (selectedInquiry.modifiedTime) {
    date = "작성 시간 : " + formatDateTime(selectedInquiry.modifiedTime * 1000) + " (수정됨)";
  }

  // 로그인된 사용자와 게시물 작성자를 비교하여 수정 및 삭제 버튼을 표시 여부 결정
  const isEditable = userNo === selectedInquiry.userNo;

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
        문의게시글 상세보기
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
        {/* 제목 */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 0 0 0",
            marginBottom: "8px"
          }}
        >
          {isEditing ? (
            <TextField
              fullWidth
              label="제목"
              value={editedTitle}
              onChange={(event) => setEditedTitle(event.target.value)}
            />
          ) : (
            <>
              <Typography variant="h6" gutterBottom>
                {selectedInquiry.title}
              </Typography>
            </>
          )}
        </Box>

        {/* 내용 */}
        <Box>
          {isEditing ? (
            <>
              {/* 내용 수정하는 곳 */}
              <TextField
                fullWidth
                multiline
                label="내용"
                value={editedContent}
                onChange={(event) => setEditedContent(event.target.value)}
                sx={{ wordWrap: "break-word", mt: 2, maxHeight: "200px", overflowY: "auto", padding: "10px 0 0 0"}}
              />
            </>
          ) : (
            <>
              {/* 생성날짜 */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mt: 1,
                }}
              >
                {editedDate ?
                  <Typography variant="body2">{editedDate}</Typography> :
                  <Typography variant="body2">{date}</Typography>
                }

              </Box>

              <Typography variant="body1" sx={{ wordWrap: "break-word", mt: 2, maxHeight: "100px", overflowY: "auto", padding: "10px 0 0 0" }}>
                {selectedInquiry.content.split('\n').map((line, index) => (
                  <React.Fragment key={index}>
                    {line}
                    <br />
                  </React.Fragment>
                ))}
              </Typography>

            </>

          )}
        </Box>

        {/* 수정 및 삭제 버튼 */}
        {isEditable && (
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            {isEditing ? (
              <>
                <Button
                  startIcon={<SaveIcon />}
                  color="primary"
                  variant="outlined"
                  sx={{ mr: 1 }}
                  onClick={() => updateInquiry(inquiryNo, editedTitle, editedContent)}
                >
                  저장
                </Button>
                <Button
                  startIcon={<CancelIcon />}
                  color="error"
                  variant="outlined"
                  onClick={() => {
                    setIsEditing(false)
                    setEditedContent(selectedInquiry.content)
                    setEditedTitle(selectedInquiry.title)
                  }}
                >
                  취소
                </Button>
              </>
            ) : (
              <>
                <Button
                  startIcon={<EditIcon />}
                  color="primary"
                  variant="outlined"
                  sx={{ mr: 1 }}
                  onClick={() => setIsEditing(true)}
                >
                  수정
                </Button>
                <Button
                  startIcon={<DeleteIcon />}
                  color="error"
                  variant="outlined"
                  onClick={() => deleteInquiry(inquiryNo)}
                >
                  삭제
                </Button>
              </>
            )}
          </Box>
        )}

        {/* 목록으로 가기 버튼 */}
        <Button
          component="a"
          href="/board/inquiry"
          startIcon={<ArrowBackIcon />}
          color="inherit"
          sx={{ mt: 2 }}
        >
          목록으로 가기
        </Button>
      </Box>
    </Box>
  );

  function deleteInquiry(inquiryNo) {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      axios.delete("https://i9a203.p.ssafy.io/backapi/api/v1/inquiry/" + inquiryNo,
        {
          headers: {
            "AccessToken": "Bearer " + accessToken
          }
        }).then((response) => {
            window.location.href = "/board/inquiry"
          alert(response.data.msg);

        })
    }
  }

  async function updateInquiry(inquiryNo, editedTitle, editedContent) {
    if (window.confirm("변경된 내용을 저장하시겠습니까?")) {

      await axios.put("https://i9a203.p.ssafy.io/backapi/api/v1/inquiry/" + inquiryNo,
        {
          title: editedTitle,
          content: editedContent
        },
        {
          headers: {
            "AccessToken": "Bearer " + accessToken
          }
        }).then((response) => {
          setIsEditing(false);
          setSelectedInquiry(response.data);
        }).then(() => {
          setEditedDate("작성 시간 : " + formatDateTime(selectedInquiry.modifiedTime * 1000) + " (수정됨)");
        })
    }
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