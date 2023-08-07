import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
} from "@mui/material";

const UserInformation = ({
  profile,
  isEditing,
  onChange,
  onUpdate,
  showEditButton = true,
}) => {
  const [editData, setEditData] = useState(profile);

  const handleEdit = () => {
    setEditData(profile); // 편집 시작 시 현재 프로필을 editData로 복사
    onChange(true); // 편집 모드로 전환
  };

  const handleSave = () => {
    if (typeof onUpdate === "function") {
      onUpdate(editData); // 부모 컴포넌트에 업데이트 된 데이터를 전달
    }
    onChange(false); // 편집 모드 종료
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
                  label="Location"
                  value={editData.location}
                  onChange={(e) => handleChange("location", e.target.value)}
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
                지역: {profile.location}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                component="div"
              >
                이메일: {profile.email}
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
