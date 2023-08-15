import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, Button, TextField, Input } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FavoriteIcon from "@mui/icons-material/Favorite";
import axios from "axios";

import defaultDog1 from "../../assets/images/dog/dog1.png";
import defaultDog2 from "../../assets/images/dog/dog2.png";
import defaultDog3 from "../../assets/images/dog/dog3.png";
import defaultDog4 from "../../assets/images/dog/dog4.png";
import defaultDog5 from "../../assets/images/dog/dog5.png";
import defaultDog6 from "../../assets/images/dog/dog6.png";
import defaultDog7 from "../../assets/images/dog/dog7.png";
import defaultDog8 from "../../assets/images/dog/dog8.png";

export default function AdoptionReviewDetail() {
  const { boardNo } = useParams();
  const userNo = JSON.parse(localStorage.getItem("user"))?.userNo;

  const [selectedReview, setSelectedReview] = useState(null);
  const [isLiked, setIsLiked] = useState(false);

  const accessToken = JSON.parse(sessionStorage.getItem("token"))?.accessToken;

  // 입양후기 수정을 위한 값
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const [editedDate, setEditedDate] = useState(null);
  const [imagePath, setImagePath] = useState(null);

  const [replyList, setReplyList] = useState([]);
  const [replyContent, setReplyContent] = useState("");

  const [visibleComments, setVisibleComments] = useState(3);

  const [editedReplyId, setEditedReplyId] = useState(null);
  const [editedReplyContent, setEditedReplyContent] = useState("");

  const dogImages = [
    defaultDog1,
    defaultDog2,
    defaultDog3,
    defaultDog4,
    defaultDog5,
    defaultDog6,
    defaultDog7,
    defaultDog8,
  ];

  const getRandomDogImagePath = () => {
    return dogImages[boardNo % 8];
  };

  useEffect(() => {
    // 게시글 정보 가져오기
    axios
      .get(`https://i9a203.p.ssafy.io/backapi/api/v1/board/${boardNo}`)
      .then((response) => {
        setSelectedReview(response.data);
        setEditedTitle(response.data.title);
        setEditedContent(response.data.content);
        setEditedDate(
          response.data.modifiedTime
            ? "작성 시간 : " +
                formatDateTime(response.data.modifiedTime * 1000) +
                " (수정됨)"
            : "작성 시간 : " + formatDateTime(response.data.createdTime * 1000)
        );

        if (!response.data.imagePath) {
          setImagePath(getRandomDogImagePath());
        } else {
          setImagePath(
            `https://i9a203.p.ssafy.io/backapi/api/v1/image/` +
              response.data.imagePath +
              "?option=board"
          );
        }
      });

    // 댓글 정보 가져오기
    axios
      .get(`https://i9a203.p.ssafy.io/backapi/api/v1/reply/${boardNo}`)
      .then((response) => {
        setReplyList(response.data);
      });

    if (accessToken) {
      // 좋아요 체크
      axios
        .get(`https://i9a203.p.ssafy.io/backapi/api/v1/board/like/` + boardNo, {
          headers: {
            AccessToken: "Bearer " + accessToken,
          },
        })
        .then((response) => {
          setIsLiked(response.data.result);
        });
    }
  }, [boardNo, accessToken]);

  if (!selectedReview) {
    return <div>게시글을 찾을 수 없습니다.</div>;
  }

  // 수정되었으면 수정 시간, 그렇지 않으면 작성 시간으로 설정
  let date = "작성 시간 : " + formatDateTime(selectedReview.createdTime * 1000);

  if (selectedReview.modifiedTime) {
    date =
      "작성 시간 : " +
      formatDateTime(selectedReview.modifiedTime * 1000) +
      " (수정됨)";
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
        marginBottom: "30px",
      }}
    >
      <Typography variant="h5" gutterBottom>
        입양후기 상세보기
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
            padding: "10px 0 0 0",
            marginBottom: "8px",
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
                {selectedReview.title}
              </Typography>
              <Typography variant="body2">
                조회수: {Math.round(selectedReview.viewCnt / 2)}
              </Typography>
            </>
          )}
        </Box>

        {/* 사진 */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "8px",
          }}
        >
          <img
            src={imagePath}
            alt="게시글 이미지"
            style={{ height: "400px", objectFit: "cover" }}
          />
        </Box>

        {/* 내용 */}
        <Box>
          {isEditing ? (
            <>
              {/* 이미지 업로드 */}
              <input
                type="file"
                accept=".jpg, .jpeg, .png, .gif"
                onChange={(event) => setSelectedFile(event.target)}
              />

              {/* 내용 수정하는 곳 */}
              <TextField
                fullWidth
                multiline
                label="내용"
                value={editedContent}
                onChange={(event) => setEditedContent(event.target.value)}
                sx={{
                  wordWrap: "break-word",
                  mt: 2,
                  maxHeight: "200px",
                  overflowY: "auto",
                  padding: "10px 0 0 0",
                }}
              />
            </>
          ) : (
            <>
              {/* 생성날짜와 좋아요 개수 */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mt: 1,
                }}
              >
                {editedDate ? (
                  <Typography variant="body2">{editedDate}</Typography>
                ) : (
                  <Typography variant="body2">{date}</Typography>
                )}
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
                <Box
                  sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}
                >
                  <Button
                    onClick={() => likeBoard(boardNo)}
                    startIcon={<FavoriteIcon />}
                    color="primary"
                    variant="contained"
                  >
                    좋아요
                  </Button>
                </Box>
              )}
              {isLiked && (
                <Box
                  sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}
                >
                  <Button
                    onClick={() => dislikeBoard(boardNo)}
                    startIcon={<FavoriteIcon />}
                    color="error"
                    variant="outlined"
                  >
                    좋아요 취소
                  </Button>
                </Box>
              )}
              <Typography
                variant="body1"
                sx={{
                  wordWrap: "break-word",
                  mt: 2,
                  maxHeight: "100px",
                  overflowY: "auto",
                  padding: "10px 0 0 0",
                }}
              >
                {selectedReview.content.split("\n").map((line, index) => (
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
                  variant="contained"
                  sx={{ mr: 1 }}
                  onClick={() =>
                    updateBoard(
                      boardNo,
                      editedTitle,
                      editedContent,
                      selectedFile
                    )
                  }
                >
                  저장
                </Button>
                <Button
                  startIcon={<CancelIcon />}
                  color="error"
                  variant="contained"
                  onClick={() => {
                    setIsEditing(false);
                    setEditedContent(selectedReview.content);
                    setEditedTitle(selectedReview.title);
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
                  variant="contained"
                  sx={{ mr: 1 }}
                  onClick={() => setIsEditing(true)}
                >
                  수정
                </Button>
                <Button
                  startIcon={<DeleteIcon />}
                  color="error"
                  variant="contained"
                  onClick={() => deleteBoard(boardNo)}
                >
                  삭제
                </Button>
              </>
            )}
          </Box>
        )}

        {/* 댓글 목록 */}
        {replyList[0] ? (
          <>
            <Typography variant="h6" gutterBottom>
              댓글 목록{" "}
              <Typography>작성된 댓글 {replyList.length}개</Typography>
            </Typography>
            <Box
              sx={{
                mt: 2,
                maxHeight: "500px",
                overflowY: "auto",
              }}
            >
              {visibleComments < replyList.length ? (
                <Button
                  variant="outlined"
                  color="primary"
                  sx={{
                    mt: 1,
                    height: "30px",
                    margin: "auto",
                  }}
                  onClick={loadMoreComments}
                >
                  모든 댓글 보기
                </Button>
              ) : (
                <></>
              )}
              {replyList
                .slice(
                  replyList.length - visibleComments >= 0
                    ? replyList.length - visibleComments
                    : 0,
                  replyList.length
                )
                .map((reply, index) => (
                  <Box
                    key={index}
                    sx={{
                      border: "1px solid #ccc",
                      borderRadius: "5px",
                      padding: "8px",
                      margin: "8px 0",
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                      작성자: {reply.writer}
                    </Typography>
                    {editedReplyId === reply.replyNo ? (
                      // Display the input field for editing
                      <TextField
                        fullWidth
                        multiline
                        label="댓글 수정"
                        value={editedReplyContent}
                        onChange={(event) =>
                          setEditedReplyContent(event.target.value)
                        }
                      />
                    ) : (
                      // Display the reply content
                      <Typography variant="body2">
                        {reply.content.split("\n").map((line, index) => (
                          <React.Fragment key={index}>
                            {line}
                            <br />
                          </React.Fragment>
                        ))}
                      </Typography>
                    )}
                    {reply.modifiedTime ? (
                      <Typography variant="body2" sx={{ color: "#888" }}>
                        작성 시간: {formatDateTime(reply.modifiedTime * 1000)}{" "}
                        (수정됨)
                      </Typography>
                    ) : (
                      <Typography variant="body2" sx={{ color: "#888" }}>
                        작성 시간: {formatDateTime(reply.createdTime * 1000)}
                      </Typography>
                    )}
                    {/* 이건,,, 나중에하는걸로 */}
                    {/* <Typography variant="body2" sx={{ color: "#888" }}>
                    좋아요 개수: {reply.likeCnt}
                  </Typography> */}
                    {reply.userNo === userNo ? (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "end",
                          position: "relative",
                        }}
                      >
                        {editedReplyId === reply.replyNo ? (
                          <>
                            <Button
                              sx={{ margin: "0 3px 0 3px" }}
                              variant="outlined"
                              size="small"
                              color="primary"
                              onClick={() =>
                                updateReply(reply.replyNo, editedReplyContent)
                              }
                            >
                              저장
                            </Button>
                            <Button
                              sx={{ margin: "0 3px 0 3px" }}
                              variant="outlined"
                              size="small"
                              color="error"
                              onClick={() => cancelEdit()}
                            >
                              취소
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              sx={{ margin: "0 3px 0 3px" }}
                              variant="outlined"
                              size="small"
                              color="primary"
                              onClick={() =>
                                startEdit(reply.replyNo, reply.content)
                              }
                            >
                              수정
                            </Button>
                            <Button
                              sx={{ margin: "0 3px 0 3px" }}
                              variant="outlined"
                              size="small"
                              color="error"
                              onClick={() => deleteReply(reply.replyNo)}
                            >
                              삭제
                            </Button>
                          </>
                        )}
                      </Box>
                    ) : (
                      <></>
                    )}
                  </Box>
                ))}
            </Box>
          </>
        ) : (
          <Box>작성된 댓글이 없습니다.</Box>
        )}

        {/* 댓글 입력 창 */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" gutterBottom>
            댓글 작성
          </Typography>
          <TextField
            fullWidth
            multiline
            label="댓글 내용"
            value={replyContent}
            onChange={(event) => setReplyContent(event.target.value)}
          />
          <Button
            variant="outlined"
            color="primary"
            sx={{ mt: 1 }}
            onClick={submitReply}
          >
            댓글 작성
          </Button>
        </Box>

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

  function loadMoreComments() {
    setVisibleComments(replyList.length);
  }

  function likeBoard(boardNo) {
    if (!accessToken) {
      alert("로그인이 필요합니다.");
      return;
    }

    axios
      .post(
        "https://i9a203.p.ssafy.io/backapi/api/v1/board/like/" + boardNo,
        {},
        {
          headers: {
            AccessToken: "Bearer " + accessToken,
          },
        }
      )
      .then(() => {
        setIsLiked(true);
        selectedReview.likeCnt++;
      });
  }

  function dislikeBoard(boardNo) {
    if (!accessToken) {
      alert("로그인이 필요합니다.");
      return;
    }

    axios
      .delete(
        "https://i9a203.p.ssafy.io/backapi/api/v1/board/like/" + boardNo,
        {
          headers: {
            AccessToken: "Bearer " + accessToken,
          },
        }
      )
      .then(() => {
        setIsLiked(false);
        selectedReview.likeCnt--;
      });
  }

  function deleteBoard(boardNo) {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      axios
        .delete("https://i9a203.p.ssafy.io/backapi/api/v1/board/" + boardNo, {
          headers: {
            AccessToken: "Bearer " + accessToken,
          },
        })
        .then((response) => {
          alert(response.data.msg);
          window.location.href = "/board/adoption-review";
        });
    }
  }

  async function updateBoard(boardNo, editedTitle, editedContent, imageFile) {
    if (window.confirm("변경된 내용을 저장하시겠습니까?")) {
      let imagePath = null;

      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile.files[0]);

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
        .put(
          "https://i9a203.p.ssafy.io/backapi/api/v1/board/" + boardNo,
          {
            title: editedTitle,
            content: editedContent,
            imagePath: imagePath,
          },
          {
            headers: {
              AccessToken: "Bearer " + accessToken,
            },
          }
        )
        .then((response) => {
          setIsEditing(false);
          setSelectedReview(response.data);
        })
        .then(() => {
          setEditedDate(
            "작성 시간 : " +
              formatDateTime(selectedReview.modifiedTime * 1000) +
              " (수정됨)"
          );
        });
    }
  }

  async function submitReply() {
    if (!userNo) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (replyContent.trim() === "") {
      alert("댓글 내용을 입력해주세요.");
      return;
    }

    const requestBody = {
      boardNo: boardNo,
      content: replyContent,
    };

    try {
      const response = await axios.post(
        `https://i9a203.p.ssafy.io/backapi/api/v1/reply`,
        requestBody,
        {
          headers: {
            AccessToken: "Bearer " + accessToken,
          },
        }
      );

      if (response.status === 201) {
        alert("댓글이 작성되었습니다.");
        setReplyList(response.data);
        setReplyContent("");
      }
    } catch (error) {
      alert("댓글 작성에 실패했습니다.");
    }
  }

  function startEdit(replyId, content) {
    setEditedReplyId(replyId);
    setEditedReplyContent(content);
  }

  function cancelEdit() {
    setEditedReplyId(null);
    setEditedReplyContent("");
  }

  async function deleteReply(replyId) {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    await axios
      .delete(`https://i9a203.p.ssafy.io/backapi/api/v1/reply/${replyId}`, {
        headers: {
          AccessToken: "Bearer " + accessToken,
        },
      })
      .then((response) => {
        if (response.status == 200) {
          axios
            .get(`https://i9a203.p.ssafy.io/backapi/api/v1/reply/${boardNo}`)
            .then((response) => {
              setReplyList(response.data);
            });

          alert("삭제 완료");
        }
      });
  }

  async function updateReply(replyId, editedContent) {
    if (!window.confirm("저장하시겠습니까?")) return;

    if (editedContent.trim() === "") {
      alert("댓글 내용을 입력해주세요.");
      return;
    }

    try {
      await axios
        .put(
          `https://i9a203.p.ssafy.io/backapi/api/v1/reply/${replyId}`,
          { content: editedContent },
          {
            headers: {
              AccessToken: "Bearer " + accessToken,
            },
          }
        )
        .then(() => {
          const updatedReplyList = replyList.map((reply) =>
            reply.replyNo === replyId
              ? {
                  ...reply,
                  content: editedContent,
                  modifiedTime: new Date().getTime(),
                }
              : reply
          );

          setReplyList(updatedReplyList);
          cancelEdit(replyId); // Clear the editing state
          alert("수정되었습니다.");
        });
    } catch (error) {
      alert("댓글 수정에 실패했습니다.");
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
