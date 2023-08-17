import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import { TextField, Button, Paper, Typography } from "@mui/material";
import { config } from "../../static/config";
import { useNavigate } from "react-router-dom";
import ChatIcon from "./ChatIcon.png";

function ChatSidebar({ shelterNo }) {
  const [chats, setChats] = useState([]);
  const [newChat, setNewChat] = useState("");
  const token = JSON.parse(sessionStorage.getItem("token"));
  const chatContainerRef = useRef(null);
  const navigate = useNavigate();
  const scrollToBottom = () => {
    const chatDiv = chatContainerRef.current;
    if (chatDiv) {
      chatDiv.scrollTop = chatDiv.scrollHeight;
    }
  };
  const isUserLoggedIn = () => {
    const token = JSON.parse(sessionStorage.getItem("token"));
    return token !== null; // 로그인된 경우 true, 로그인되지 않은 경우 false 반환
  };

  useEffect(() => {
    scrollToBottom();
  }, [chats]);

  // 채팅 목록 불러오기
  const fetchChats = () => {
    axios
      .get(`${config.baseURL}/api/v1/shelter/${shelterNo}/chat`)
      .then((res) => {
        setChats(res.data);
      })
      .catch((err) => {
        console.error("Failed to fetch chats:", err);
      });
  };

  // 채팅 등록하기
  const handleChatSubmit = () => {
    if (!isUserLoggedIn()) {
      alert("로그인 후에 사용하실 수 있습니다. 로그인 페이지로 이동합니다.");

      navigate("/login");
      // 로그인 페이지로 이동하는 코드를 추가하세요.
      return; // 이후의 코드 실행을 중단합니다.
    }

    axios

      .post(
        `${config.baseURL}/api/v1/shelter/chat`,
        {
          content: newChat,
          shelterNo: shelterNo, // 필요한 정보를 body에 추가
        },
        { headers: { AccessToken: `Bearer ${token.accessToken}` } }
      )
      .then(() => {
        setNewChat("");
        fetchChats(); // 채팅 등록 후 채팅 목록 다시 불러오기
      })
      .catch((err) => {
        console.error("Failed to post chat:", err);
      });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleChatSubmit();
    }
  };

  useEffect(() => {
    fetchChats();
  }, [shelterNo]);

  return (
    <div>
      <span
        style={{ display: "block", textAlign: "center", marginTop: "12px" }}
      >
        <img
          src={ChatIcon}
          alt="CHAT WITH SHELTER"
          style={{ maxHeight: "35px" }}
        />
      </span>
      <div
        ref={chatContainerRef}
        style={{
          height: "300px",
          overflowY: "scroll",
          border: "10px solid lightgrey",
          borderColor: "var(--yellow6)",
          backgroundColor: "white",
          whiteSpace: "normal",
          overflowWrap: "break-word",
        }}
      >
        {chats
          .slice()
          .reverse()
          .map((chat, index) => (
            <Paper
              key={index}
              elevation={3}
              style={{
                padding: "10px",
                maxWidth: "66%",
                margin:
                  chat.userNo == shelterNo
                    ? "10px auto 10px 10px" // 보호소일 경우 왼쪽 정렬
                    : "10px 10px 10px auto", // 그 외 오른쪽 정렬
                borderRadius: "20px",
                backgroundColor:
                  chat.userNo == shelterNo ? "lightblue" : "lightgrey",
              }}
            >
              <Typography variant="caption">{chat.name}</Typography>
              <div>{chat.userName}</div>
              <Typography variant="body1">{chat.content}</Typography>
            </Paper>
          ))}
      </div>
      <TextField
        label="새 채팅"
        variant="outlined"
        value={newChat}
        onChange={(e) => setNewChat(e.target.value)}
        onKeyDown={handleKeyDown}
        sx={{
          "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "var(--yellow8)",
          },
        }}
        InputLabelProps={{
          style: { color: "var(--yellow9)" },
        }}
        style={{
          backgroundColor: "white", 
          marginLeft: "10px", 
          width: "73%", 
          marginRight: "10px", 
          borderRadius: "5px"
        }}
      />
      <Button onClick={handleChatSubmit} variant="contained" style={{ backgroundColor: "var(--yellow9)", fontWeight: "bold", marginTop: "7px", minHeight: "40px"}}>
        전송
      </Button>
    </div>
  );
}

export default ChatSidebar;
