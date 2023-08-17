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

const commandMapping = {
  "정지": 2,
  "간식초기화": 8
};

function BroadCastingView({ timerLimit = 30, isLiveSession = false, token, getshelterNo }) {
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
  const [currentUserId, setCurrentUserId] = useState(currentUser.userId);

  const [isUserMatched, setIsUserMatched] = useState(false);

  const sessionInstance2 = useSelector(state => state.session.sessionInstance)
  const subscribers2 = useSelector(state => state.session.subscribers)
  const [subscribers, setSubscribers] = useState([]);
  const publisherFromStore = useSelector(state => state.session.publisher);

  const navigate = useNavigate();

  // SSE 연결
  function connect() {
    const sse = new EventSource("https://i9a203.p.ssafy.io/backapi/api/v1/broadcast/connect");

    sse.addEventListener("connect", (e) => {
      const { data: receivedConnectData } = e;
      console.log("connect event data: ", receivedConnectData); // "connected!"
    });

    sse.addEventListener('data', e => {
      const { data } = e;
      const { userId, remainTime } = JSON.parse(data); // 문자열을 JSON으로 파싱

      console.log("userName : " + userId);
      setCurrentUserId(userId);
      setIsPlaying(true);
      setSeconds(remainTime);
    });

    return () => {
      sse.close();
    };
  }
  useEffect(() => {
    if (!isPlaying) {
      setCurrentUserId(currentUser.userId);

      ["정지", "간식초기화"].forEach(commandText => {
        const commandValue = commandMapping[commandText];
        if (commandValue === undefined) {
            console.error("알 수 없는 명령:", commandText);
            return;
        }

        const token = JSON.parse(sessionStorage.getItem("token"));
        const accessToken = token.accessToken;

        axios.post(`https://i9a203.p.ssafy.io/backapi/api/v1/iot/${broadcastId}`, {
          command: commandValue
        }, {
          headers: {
            AccessToken: `Bearer ${accessToken}`
          }
        })
        .then(response => {
          console.log(`'${commandText}' 명령이 성공적으로 전송되었습니다.`);
        })
        .catch(error => {
          console.error(`'${commandText}' 명령 전송 중 오류 발생:`, error);
        });
      });
    }
  }, [isPlaying]);

  // useEffect를 사용하여 페이지가 처음 렌더링될 때 connect 함수 호출
  useEffect(() => {
    connect();
  }, []);

  useEffect(() => {
    if (isLiveSession && token) {
      const sessionInstance = sessionInstance2;

      sessionInstance.on('streamCreated', (event) => {
          const subscriber = sessionInstance.subscribe(event.stream, 'myVideoContainer');
          setSubscribers(prevSubscribers => [...prevSubscribers, subscriber]);
          setHasStream(true);
          console.log('hasStream', hasStream);
      });

      sessionInstance.on('streamDestroyed', (event) => {
          console.log('세션꺼짐');
          setHasStream(false);
      });

      // 컴포넌트가 언마운트될 때 실행될 cleanup 함수
      return () => {
          if (sessionInstance2) {
              sessionInstance2.disconnect();
          }
      };
    } else {
        console.log('문제있는상태');
        console.log('isLiveSession', isLiveSession);
        console.log('받은token:', token);
    }
  }, [isLiveSession, token, sessionInstance2]);

  useEffect(() => {
    // localStorage에서 user 데이터 파싱
    let userData;
    try {
      userData = JSON.parse(localStorage.getItem("user"));
    } catch (error) {
      console.error("localStorage에서 user 데이터 파싱 중 오류 발생:", error);
    }

    // userNo 값 확인 및 숫자로 변환
    const userNo = userData && userData.userNo ? Number(userData.userNo) : null;
    if (userNo) {
      if (getshelterNo === userNo.toString()) {
        console.log("getshelterNo와 userNo가 일치합니다.");
        setIsUserMatched(true);
      } else {
        console.log("getshelterNo와 userNo가 일치하지 않습니다.");
        console.log(getshelterNo);
        console.log(userData);
        console.log(userNo);
      }
    }
    
  }, [getshelterNo]);

  useEffect(() => {
    if (isUserMatched && subscribers.length === 0 && publisherFromStore) {
      setSubscribers([publisherFromStore]);
    }
  }, [isUserMatched, subscribers, publisherFromStore]);


  useEffect(() => {
    const token = JSON.parse(sessionStorage.getItem("token"));

    if(!token) {
      window.alert("로그인이 필요합니다.")
      navigate("/login");
      return;
    }

    let interval;
    if (isPlaying && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);
    }

    if (isPlaying && seconds === 0) {
      setIsPlaying(false);
      setOpenDialog(true);
      setSeconds(timerLimit);
      dispatch(setshowDevice(false));
    }

    return () => clearInterval(interval);
  }, [isPlaying, seconds, dispatch, timerLimit]);

  const handleStopBroadcast = () => {
    const token = JSON.parse(sessionStorage.getItem("token"));
    const accessToken = token?.accessToken


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
    const token = JSON.parse(sessionStorage.getItem("token"));
    const accessToken = token?.accessToken

    axios.post(`https://i9a203.p.ssafy.io/backapi/api/v1/broadcast/request/${Number(broadcastId)}`, {}, {
    headers: {
      AccessToken: `Bearer ${accessToken}`
    }
  })
  .then(response => {
    if (response.status === 200) {
      setIsPlaying(true);
      setSeconds(timerLimit);
      dispatch(setshowDevice(true));
      console.log('기기조작요청 response', response)
      console.log('놀아주기 요청이 성공적으로 전송되었습니다.');
    }
    
  })
  .catch(error => {
    if (error.response && error.response.status) {
      switch (error.response.status) {
        case 403:
          alert('이미 다른분과 놀고있어요');
          break;
        case 409:
          alert('토큰이 부족해요');
          break;
        default:
          console.error('놀아주기 요청 전송 중 오류 발생:', error);
      }
    } else {
      console.error('놀아주기 요청 전송 중 오류 발생:', error);
    }
  });
  };

  const handleConfirmOpen = () => {
    setConfirmDialog(true);
  };

  const handleConfirmClose = () => {
    setConfirmDialog(false);
  };

  const handleConfirmStop = () => {
    const token = JSON.parse(sessionStorage.getItem("token"));
    const accessToken = token?.accessToken;
  
    axios.delete(`https://i9a203.p.ssafy.io/backapi/api/v1/broadcast/request/${Number(broadcastId)}`, {
      headers: {
        AccessToken: `Bearer ${accessToken}`
      },
    })
    .then(response => {
      setIsPlaying(false);
      setSeconds(timerLimit);
      dispatch(setshowDevice(false));
      setConfirmDialog(false);
    })
    .catch(error => {
      console.error("놀기 종료 중 오류 발생:", error);
      console.log(accessToken);
    });
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
          {isPlaying && currentUserId === currentUser.userId && (
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
                    <UserVideoComponent style={{ width: '100%', height: '100%' }} streamManager={isUserMatched ? subscribers[0] : subscribers2[0]} />
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
