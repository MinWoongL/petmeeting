import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import { TextField, Button, Paper, Typography } from "@mui/material";
import { config } from "../../static/config";
function ChatSidebar({ shelterNo }) {
  const [chats, setChats] = useState([]);
  const [newChat, setNewChat] = useState("");
  const token = JSON.parse(sessionStorage.getItem("token"));
  const chatContainerRef = useRef(null);

  const scrollToBottom = () => {
    const chatDiv = chatContainerRef.current;
    if (chatDiv) {
      chatDiv.scrollTop = chatDiv.scrollHeight;
    }
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
      <h3>채팅</h3>
      <div
        ref={chatContainerRef}
        style={{
          height: "300px", // 채팅창의 높이 설정
          overflowY: "scroll", // 세로 스크롤 허용
          border: "1px solid lightgrey", // 경계선 추가
          borderRadius: "10px", // 모서리 둥글게
          padding: "10px",
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
        value={newChat}
        onChange={(e) => setNewChat(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <Button onClick={handleChatSubmit} variant="contained" color="primary">
        전송
      </Button>
    </div>
  );
}

export default ChatSidebar;
