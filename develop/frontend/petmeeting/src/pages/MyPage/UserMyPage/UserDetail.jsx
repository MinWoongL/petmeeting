import React, { useState, useEffect } from "react";
import axios from "axios";
import UserInformation from "../../../components/MyPage/UserInformation";
import Button from "@mui/material/Button";
import UserBookmarkDog from "../../../components/MyPage/UserBookmarkDog";
import UserLikeDog from "../../../components/MyPage/UserLikeDog";

function UserProfilePage() {
  const [userData, setUserData] = useState(null);
  const [isEditing, setEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [view, setView] = useState("info");
  const token = JSON.parse(sessionStorage.getItem("token"));

  const handleChange = (field, value) => {
    setEditData({
      ...editData,
      [field]: value,
    });
  };

  const handleUpdate = (updatedData) => {
    setUserData(updatedData);
  };

  const handleEditButtonClick = () => {
    if (isEditing) {
      handleEdit();
    } else {
      setEditData(userData);
    }
    setEditing(!isEditing);
  };

  useEffect(() => {
    axios
      .get(`https://i9a203.p.ssafy.io/backapi/api/v1/user`, {
        headers: { AccessToken: `Bearer ${token.accessToken}` },
      })
      .then((res) => {
        setUserData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleEdit = async () => {
    if (isEditing) {
      try {
        await axios.put(
          `https://i9a203.p.ssafy.io/backapi/api/v1/user`,
          editData,
          { headers: { AccessToken: `Bearer ${token.accessToken}` } }
        );
        setUserData(editData);
      } catch (error) {
        console.error("Failed to update user data:", error);
      }
    } else {
      setEditData(userData);
    }
    setEditing(!isEditing);
  };

  if (!userData) return <div>Loading...</div>;

  return (
    <div>
      <UserInformation
        profile={userData}
        isEditing={isEditing}
        onChange={handleChange}
        onUpdate={handleUpdate}
      />
      <div>
        <Button variant="outlined" onClick={handleEditButtonClick}>
          {isEditing ? "Save" : "Edit"}
        </Button>
        <Button onClick={() => setView("like")}>좋아하는 개 보기</Button>
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
