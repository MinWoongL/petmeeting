import React, { useState, useEffect } from "react";
import axios from "axios";
import UserInformation from "../../../components/MyPage/UserInformation";
import Button from "@mui/material/Button";

function UserProfilePage() {
  const [userData, setUserData] = useState(null);
  const [isEditing, setEditing] = useState(false);
  const [editData, setEditData] = useState({});

  const token = JSON.parse(sessionStorage.getItem("token"));

  const handleChange = (field, value) => {
    setEditData({
      ...editData,
      [field]: value,
    });
  };
  const handleEditingChange = (editing) => {
    setEditing(editing);
  };
  const handleUpdate = (updatedData) => {
    setUserData(updatedData);
  };

  const handleEditButtonClick = () => {
    if (isEditing) {
      handleEdit(); // 편집 상태에서 'Save'를 클릭하면 데이터를 저장
    } else {
      setEditData(userData); // 'Edit'를 클릭하면 편집 데이터 설정
    }
    setEditing(!isEditing); // 편집 모드 토글
  };

  useEffect(() => {
    axios
      .get(`https://i9a203.p.ssafy.io/backapi/api/v1/user`, {
        headers: { AccessToken: `Bearer ${token.accessToken}` },
      })
      .then((res) => {
        setUserData(res.data);
        console.log(res.data, "유저 데이터임");
      })
      .catch((err) => {
        console.log("API get요청 제대로 못받아왔음");
        console.log(err);
      });
  }, []);

  if (!userData) return <div>Loading...</div>;

  const handleEdit = async () => {
    if (isEditing) {
      try {
        await axios.put(
          `https://i9a203.p.ssafy.io/backapi/api/v1/user`,
          editData,
          { headers: { AccessToken: `Bearer ${token.accessToken}` } }
        );
        console.log(editData, "에딧데이터임");
        setUserData(editData);
      } catch (error) {
        console.error("Failed to update user data:", error);
      }
    } else {
      setEditData(userData);
    }
    setEditing(!isEditing);
  };

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
      </div>
    </div>
  );
}

export { UserProfilePage as UserDetail };
export default UserProfilePage;
