import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux"; // Redux store에서 상태를 가져오기 위한 훅
import {
  Box,
  Typography,
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  Paper,
} from "@mui/material";
import { useParams } from "react-router-dom";

function BroadCastingView({ timerLimit = 10 }) {
  // 상태 선언 부분
  const [seconds, setSeconds] = useState(timerLimit);
  const [isPlaying, setIsPlaying] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const { broadcastId } = useParams();
  const liveStreamId = broadcastId;

  // Redux store에서 사용자 정보 가져오기
  const currentUser = useSelector((state) => state.user);
  const isLoggedIn = currentUser.isLoggedIn;
  const currentUserId = currentUser.userId;

  // 라이브 스트림 ID를 저장
  // const liveStreamId = "36YnV9STBqc";  // 아무 Live 방송 ID

  // 타이머 및 다이얼로그 로직
  useEffect(() => {
    let interval;
    if (isPlaying && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);
    }

    if (isPlaying && seconds === 0) {
      setIsPlaying(false);
      setOpenDialog(true);
    }

    return () => clearInterval(interval);
  }, [isPlaying, seconds]);

  // 시간 포맷 함수
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  // 이벤트 핸들러 함수들
  const handlePlayClick = () => {
    setIsPlaying(true);
    setSeconds(timerLimit);
  };

  const handleStopClick = () => {
    setIsPlaying(false);
    setSeconds(timerLimit);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    // 주요 렌더링 부분
    <Paper
      elevation={3}
      sx={{ padding: 3, borderRadius: 2, width: "80%", margin: "auto", mt: 5 }}
    >
      {/* 사용자 및 버튼 표시 부분 */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {isPlaying ? (
            <>
              <Avatar src={currentUser.avatarUrl} />
              <Typography variant="h6" sx={{ ml: 2, color: "gray" }}>
                {currentUserId} 님과 놀고있어요
              </Typography>
            </>
          ) : (
            isLoggedIn && (
              <Button
                variant="contained"
                color="primary"
                onClick={handlePlayClick}
                sx={{ textTransform: "none" }}
              >
                놀아주기
              </Button>
            )
          )}
        </Box>
        {/* 타이머 및 그만놀기 버튼 부분 */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "red",
            padding: "0.5rem",
            borderRadius: "8px",
          }}
        >
          {isPlaying && (
            <Button
              variant="contained"
              color="secondary"
              sx={{ mr: 2, fontSize: "0.75rem", textTransform: "none" }}
              onClick={handleStopClick}
            >
              그만놀기
            </Button>
          )}
          <Typography variant="h6" sx={{ color: "white" }}>
            {formatTime(seconds)}
          </Typography>
        </Box>
      </Box>

      {/* 라이브 스트리밍 영상 출력 부분 */}
      <Box
        sx={{
          mt: 3,
          display: "flex",
          justifyContent: "center",
          border: "1px solid gray",
          height: 400,
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        <iframe
          width="100%"
          height="100%"
          src={
            "https://www.youtube.com/embed/" +
            liveStreamId +
            "?autoplay=1&mute=1"
          }
          title="Live Stream"
          allowFullScreen
        ></iframe>
      </Box>

      {/* 놀기 종료 후 다이얼로그 */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          저와 놀아주셔서 감사해요! 다음에 또 놀아주세요
        </DialogTitle>
      </Dialog>
    </Paper>
  );
}

export default BroadCastingView;
