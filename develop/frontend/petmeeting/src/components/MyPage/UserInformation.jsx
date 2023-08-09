import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
} from "@mui/material";
import axios from "axios";

const UserInformation = ({
  profile,

  onUpdate,
  showEditButton = true,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(profile);
  const token = JSON.parse(sessionStorage.getItem("token"));
  const handleEdit = () => {
    setEditData(profile); // 편집 시작 시 현재 프로필을 editData로 복사
    setIsEditing(true); // 편집 모드로 전환
  }; // 편집 모드로 전환

  const handleSave = async () => {
    try {
      console.log(editData, "에딧데이터임");
      const response = await axios.put(
        `https://i9a203.p.ssafy.io/backapi/api/v1/user`,
        editData,
        { headers: { AccessToken: `Bearer ${token.accessToken}` } }
      );

      // 서버 응답을 기반으로 상태 업데이트
      if (typeof onUpdate === "function") {
        onUpdate(response.data);
      }

      setIsEditing(false); // 편집 모드 종료
    } catch (error) {
      console.error("Failed to update user data:", error);
    }
  };

  const handleChange = (field, value) => {
    setEditData({
      ...editData,
      [field]: value,
    });
  };

  return (
    <Box sx={{ border: "1px solid black" }}>
      <Card sx={{ display: "flex", flexDirection: "row" }}>
        <CardContent sx={{ flex: "1 0 auto" }}>
          {isEditing ? (
            <>
              <Box>
                <TextField
                  label="Name"
                  value={editData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                />
              </Box>
              <Box>
                <TextField
                  label="Phone Number"
                  value={editData.phoneNumber}
                  onChange={(e) => handleChange("phoneNumber", e.target.value)}
                />
              </Box>
              <Box>
                <TextField
                  label="Email"
                  value={editData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                />
              </Box>
              <Box>
                <TextField
                  type="password"
                  label="Password"
                  onChange={(e) => handleChange("password", e.target.value)}
                />
              </Box>
            </>
          ) : (
            <>
              <Typography component="div" variant="h5">
                {profile.name}
              </Typography>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                component="div"
              >
                전화번호: {profile.phoneNumber}
              </Typography>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                component="div"
              >
                보유 포인트: {profile.holdingPoint}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                component="div"
              >
                보유 멍코인: {profile.holdingToken}
              </Typography>
            </>
          )}
        </CardContent>
      </Card>
      {isEditing ? (
        <Button onClick={handleSave}>Save</Button>
      ) : (
        showEditButton && <Button onClick={handleEdit}>Edit</Button>
      )}
    </Box>
  );
};

export default UserInformation;
