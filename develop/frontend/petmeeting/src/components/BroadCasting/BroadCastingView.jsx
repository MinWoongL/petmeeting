import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setshowDevice } from "../../stores/Slices/DeviceSlice";
import {
  Box,
  Typography,
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,  // 추가된 부분
  Paper
} from "@mui/material";
import { useParams } from "react-router-dom";
import UserVideoComponent from './OpenVidu/UserVideoComponent'
import { useNavigate } from 'react-router-dom';
import axios from 'axios'

function BroadCastingView({ timerLimit = 20, isLiveSession = false, token }) {
  const dispatch = useDispatch();

  const [seconds, setSeconds] = useState(timerLimit);
  const [isPlaying, setIsPlaying] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [hasStream, setHasStream] = useState(true);
  const { broadcastId } = useParams();
  const liveStreamId = broadcastId;

  const currentUser = useSelector((state) => state.user);
  const isLoggedIn = currentUser.isLoggedIn;
  const currentUserId = currentUser.userId;

  const [isUserMatched, setIsUserMatched] = useState(false);

  const sessionInstance2 = useSelector(state => state.session.sessionInstance)
  const subscribers2 = useSelector(state => state.session.subscribers)
  const [subscribers, setSubscribers] = useState([]);

  const navigate = useNavigate();


  useEffect(() => {
    if (isLiveSession && token) {
        const sessionInstance = sessionInstance2
        
        sessionInstance.on('streamCreated', (event) => {
            const subscriber = sessionInstance.subscribe(event.stream, 'myVideoContainer');
            setSubscribers(prevSubscribers => [...prevSubscribers, subscriber]);
            setHasStream(true);
            console.log(hasStream)
        });

        sessionInstance.on('streamDestroyed', (event) => {
          console.log('세션꺼짐')
          setHasStream(false);
      });

        
    } else {
      console.log('문제있는상태')
      console.log('isLiveSession', isLiveSession)
      console.log('받은token:',token)
    }
  }, [isLiveSession, token]);

  useEffect(() => {
    // API 호출
    axios.get("https://i9a203.p.ssafy.io/backapi/api/v1/broadcast/shelter")
      .then(response => {
        const shelterNo = response.data.shelterNo;
        
        // localStorage에서 user 데이터 파싱
        let userData;
        try {
          userData = JSON.parse(localStorage.getItem("user"));
        } catch (error) {
          console.error("localStorage에서 user 데이터 파싱 중 오류 발생:", error);
        }

        // userNo 값 확인 및 숫자로 변환
        const userNo = userData && userData.userNo ? Number(userData.userNo) : null;

        if (shelterNo === userNo) {
          console.log("shelterNo와 userNo가 일치합니다.");
          setIsUserMatched(true);
        } else {
          console.log("shelterNo와 userNo가 일치하지 않습니다.");
          console.log(shelterNo);
          console.log(userData);
          console.log(userNo);
        }
      })
      .catch(error => {
        console.error("API 요청 중 오류 발생:", error);
      });
  }, []);

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
      dispatch(setshowDevice(false));
    }

    return () => clearInterval(interval);
  }, [isPlaying, seconds, dispatch]);

  const handleStopBroadcast = () => {
    const token = JSON.parse(sessionStorage.getItem("token"));
    const accessToken = token.accessToken


    axios.delete('https://i9a203.p.ssafy.io/backapi/api/v1/broadcast', {
      headers: {
        AccessToken: `Bearer ${accessToken}`
      },
    })
    .then(response => {
      // console.log("방송이 성공적으로 종료되었습니다.");
      if (sessionInstance2) {
        sessionInstance2.disconnect()
      }
      
      navigate('/');  // 기본 경로로 이동
    })
    .catch(error => {
      // console.error("방송 종료 중 오류 발생:", error);
      console.log(accessToken)
    });
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const handlePlayClick = () => {
    setIsPlaying(true);
    setSeconds(timerLimit);
    dispatch(setshowDevice(true));
  };

  const handleConfirmOpen = () => {
    setConfirmDialog(true);
  };

  const handleConfirmClose = () => {
    setConfirmDialog(false);
  };

  const handleConfirmStop = () => {
    setIsPlaying(false);
    setSeconds(timerLimit);
    dispatch(setshowDevice(false));
    setConfirmDialog(false);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  

  return (
    <Paper elevation={3} sx={{ padding: 3, borderRadius: 2, width: "80%", margin: "auto", mt: 5 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
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
              isUserMatched ? (
                <Button variant="contained" color="secondary" onClick={handleStopBroadcast} sx={{ textTransform: "none" }}>
                  방송그만하기
                </Button>
              ) : (
                <Button variant="contained" color="primary" onClick={handlePlayClick} sx={{ textTransform: "none" }}>
                  놀아주기
                </Button>
              )
            )
          )}
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", backgroundColor: "red", padding: "0.5rem", borderRadius: "8px" }}>
          {isPlaying && (
            <Button variant="contained" color="secondary" sx={{ mr: 2, fontSize: "0.75rem", textTransform: "none" }} onClick={handleConfirmOpen}>
              그만놀기
            </Button>
          )}
          <Typography variant="h6" sx={{ color: "white" }}>
            {formatTime(seconds)}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ mt: 3, display: "flex", justifyContent: "center", border: "1px solid gray", height: 400, borderRadius: "8px", overflow: "hidden" }}>
          {isLiveSession ? (
              hasStream ? (
                <div id="myVideoContainer" className="col-md-6">
                    <UserVideoComponent style={{ width: '100%', height: '100%' }} streamManager={subscribers2[0]} />
                </div>
            ) : (
                <Typography variant="h5" color="textSecondary" sx={{ alignSelf: "center" }}>
                    지금은 방송중이 아닙니다.
                </Typography>
            )
          ) : (
              <iframe width="100%" height="100%" src={"https://www.youtube.com/embed/" + liveStreamId + "?autoplay=1&mute=1"} title="Live Stream" allowFullScreen></iframe>
          )}
      </Box>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          저와 놀아주셔서 감사해요! 다음에 또 놀아주세요
        </DialogTitle>
      </Dialog>

      <Dialog open={confirmDialog} onClose={handleConfirmClose}>
        <DialogTitle>
          정말 그만놀기를 선택할까요?
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleConfirmClose} color="primary">
            취소
          </Button>
          <Button onClick={handleConfirmStop} color="primary" autoFocus>
            그만놀기
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}

export default BroadCastingView;
