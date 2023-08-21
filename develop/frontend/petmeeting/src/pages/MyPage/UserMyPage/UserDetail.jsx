import React, { useState, useEffect } from "react";
import axios from "axios";
import UserInformation from "../../../components/MyPage/UserInformation";
import UserBookmarkDog from "../../../components/MyPage/UserBookmarkDog";
import UserLikeDog from "../../../components/MyPage/UserLikeDog";
import UserAdoptionList from "../../../components/MyPage/UserAdoptionList";
import { Button, Container, Typography, Alert } from "@mui/material";
import { styled } from "@mui/system";
import { useDispatch } from "react-redux";
import { updatePointsAndTokens } from "../../../stores/Slices/UserSlice";
import { setPoint } from "../../../stores/Slices/pointSlice";
import { setToken } from "../../../stores/Slices/tokenSlice";
import UserDonationList from "../../../components/MyPage/UserDonationList";

const StyledButtonContainer = styled(Container)`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
  margin-bottom: 10px;
`;

const StyledButton = styled(Button)`
  background-color: #b9a178;
  color: white;
  &:hover {
    background-color: #6f6048;
  }
  margin-bottom: 10px;
`;

function UserProfilePage() {
  const [userData, setUserData] = useState(null);

  const [view, setView] = useState("like");
  const token = JSON.parse(sessionStorage.getItem("token"));
  const dispatch = useDispatch();
  const handleUpdate = (updatedData) => {
    setUserData(updatedData);
  };
  const [isEditing, setIsEditing] = useState(false);

  const handleEditingChange = (editing) => {
    setIsEditing(editing);
  };

  useEffect(() => {
    axios
      .get(`https://i9a203.p.ssafy.io/backapi/api/v1/user`, {
        headers: { AccessToken: `Bearer ${token.accessToken}` },
      })
      .then((res) => {
        handleUpdate(res.data);

        dispatch(
          updatePointsAndTokens({
            points: res.data.holdingPoint, // Replace with the actual keys in the API response
            tokens: res.data.holdingToken, // Replace with the actual keys in the API response
          })
        );

        dispatch(setPoint(res.data.holdingPoint));
        dispatch(setToken(res.data.holdingToken));
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  if (!userData) return <div>Loading...</div>;

  return (
    <div>
      <UserInformation
        profile={userData}
        isEditing={isEditing}
        onChange={handleEditingChange}
      />
      <StyledButtonContainer>
        <StyledButton onClick={() => setView("like")}>좋아요 목록</StyledButton>
        <StyledButton onClick={() => setView("bookmark")}>
          북마크 목록
        </StyledButton>
        <StyledButton onClick={() => setView("adoptionList")}>
          입양신청 내역
        </StyledButton>
        <StyledButton onClick={() => setView("donationList")}>
          후원 내역
        </StyledButton>
      </StyledButtonContainer>
      {view === "like" ? (
        <UserLikeDog likedDogs={userData.likedDogs} />
      ) : view === "bookmark" ? (
        <UserBookmarkDog bookmarkedDogs={userData.bookmarkedDogs} />
      ) : view === "adoptionList" ? (
        <UserAdoptionList />
      ) : view === "donationList" ? (
        <UserDonationList userNo={userData.userNo} />
      ) : null}
    </div>
  );
}

export { UserProfilePage as UserDetail };
export default UserProfilePage;
