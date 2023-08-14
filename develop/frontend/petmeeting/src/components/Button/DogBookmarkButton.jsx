import React, { useState, useEffect } from "react";
import axios from "axios";
import { config } from "../../static/config";
import IconButton from "@mui/material/IconButton";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";

const BookmarkButton = ({ dogNo }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const token = JSON.parse(sessionStorage.getItem("token"));

  // 찜 상태를 불러오는 함수
  const fetchBookmarkStatus = async () => {
    try {
      const response = await axios.get(
        `${config.baseURL}/api/v1/dog/bookmark/${dogNo}`,
        {
          headers: { AccessToken: `Bearer ${token.accessToken}` },
        }
      );
      console.log("북마크 조회 성공", response.data);
      setIsBookmarked(response.data); // 찜 상태를 설정 (서버 응답에 따라 다름)
    } catch (error) {
      console.error("Failed to fetch bookmark status:", error);
    }
  };

  // 찜 버튼 클릭 처리 함수
  const handleBookmarkClick = async (event) => {
    event.stopPropagation();
    event.preventDefault();
    try {
      if (isBookmarked) {
        await axios.delete(`${config.baseURL}/api/v1/dog/bookmark/${dogNo}`, {
          headers: { AccessToken: `Bearer ${token.accessToken}` },
        });
      } else {
        await axios.post(
          `${config.baseURL}/api/v1/dog/bookmark/${dogNo}`,
          null,
          {
            headers: { AccessToken: `Bearer ${token.accessToken}` },
          }
        );
      }
      setIsBookmarked(!isBookmarked); // 찜 상태 토글
    } catch (error) {
      console.error("Failed to update bookmark:", error);
    }
  };

  useEffect(() => {
    fetchBookmarkStatus(); // 컴포넌트가 마운트될 때 찜 상태를 불러옴
  }, [dogNo]); // dogNo가 변경될 때 찜 상태를 다시 불러옴

  return (
    <IconButton onClick={handleBookmarkClick}>
      {isBookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
    </IconButton>
  );
};

export default BookmarkButton;
