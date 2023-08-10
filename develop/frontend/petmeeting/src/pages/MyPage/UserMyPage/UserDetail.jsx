import React, { useState, useEffect } from "react";
import axios from "axios";
import UserInformation from "../../../components/MyPage/UserInformation";
import Button from "@mui/material/Button";
import UserBookmarkDog from "../../../components/MyPage/UserBookmarkDog";
import UserLikeDog from "../../../components/MyPage/UserLikeDog";

function UserProfilePage() {
  const [userData, setUserData] = useState(null);

  const [view, setView] = useState("like");
  const token = JSON.parse(sessionStorage.getItem("token"));

  const handleUpdate = (updatedData) => {
    setUserData(updatedData);
  };
  const [isEditing, setIsEditing] = useState(false);

  const handleEditingChange = (editing) => {
    setIsEditing(editing);
  };

  useEffect(() => {
    console.log(userData);
    axios
      .get(`https://i9a203.p.ssafy.io/backapi/api/v1/user`, {
        headers: { AccessToken: `Bearer ${token.accessToken}` },
      })
      .then((res) => {
        handleUpdate(res.data);
        console.log(res.data, "마이페이지 정보 겟받아옴");
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

      <div>
        <Button onClick={() => setView("like")}>좋아요 한 개 보기</Button>
        <Button onClick={() => setView("bookmark")}>북마크한 개 보기</Button>
      </div>
      {view === "like" ? (
        <UserLikeDog likedDogs={userData.likedDogs} />
      ) : view === "bookmark" ? (
        <UserBookmarkDog bookmarkedDogs={userData.bookmarkedDogs} />
      ) : null}
    </div>
  );
}

export { UserProfilePage as UserDetail };
export default UserProfilePage;
