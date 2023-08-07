import React, { useState, useEffect } from "react";
import axios from "axios";
import heartOn from "../../assets/images/pet_heart_on.png";
import heartOff from "../../assets/images/pet_heart_off.png";
import { config } from "../../static/config";

const LikeButton = ({ dogNo }) => {
  const [isLiked, setIsLiked] = useState(false);

  const token = JSON.parse(sessionStorage.getItem("token"));

  // 좋아요 상태를 불러오는 함수
  const fetchLikeStatus = async () => {
    try {
      const response = await axios.get(
        `${config.baseURL}/api/v1/dog/like/${dogNo}`,
        {
          headers: { AccessToken: `Bearer ${token.accessToken}` },
        }
      );
      console.log("좋아요 상태 받아옴", response.data.result);
      setIsLiked(response.data.result); // 좋아요 상태를 설정 (서버 응답에 따라 다름)
    } catch (error) {
      console.error("Failed to fetch like status:", error);
    }
  };

  // 좋아요 버튼 클릭 처리 함수
  const handleLikeClick = async (event) => {
    event.stopPropagation();
    event.preventDefault();
    try {
      if (isLiked) {
        await axios.delete(`${config.baseURL}/api/v1/dog/like/${dogNo}`, {
          headers: { AccessToken: `Bearer ${token.accessToken}` },
        });
      } else {
        await axios.post(`${config.baseURL}/api/v1/dog/like/${dogNo}`, null, {
          headers: { AccessToken: `Bearer ${token.accessToken}` },
        });
      }
      setIsLiked(!isLiked); // 좋아요 상태 토글
    } catch (error) {
      console.error("Failed to update like:", error);
    }
  };

  useEffect(() => {
    fetchLikeStatus(); // 컴포넌트가 마운트될 때 좋아요 상태를 불러옴
  }, [dogNo]); // dogNo가 변경될 때 좋아요 상태를 다시 불러옴

  return (
    <button
      onClick={handleLikeClick}
      style={{
        backgroundColor: "transparent",
        border: "none",
        cursor: "pointer",
        padding: 0,
      }}
    >
      <img
        src={isLiked ? heartOn : heartOff}
        alt="like"
        style={{ width: 24, height: 24 }}
      />{" "}
      좋아요
    </button>
  );
};

export default LikeButton;
