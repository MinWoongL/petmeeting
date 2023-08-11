import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Avatar,
  Divider,
} from "@mui/material";
import axios from "axios";

const ProfileCard = ({ profile, onChange, onUpdate, showEditButton = true }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(profile);
  const token = JSON.parse(sessionStorage.getItem("token"));

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(
        `https://i9a203.p.ssafy.io/backapi/api/v1/user`,
        editData,
        { headers: { AccessToken: `Bearer ${token.accessToken}` } }
      );

      if (typeof onUpdate === "function") {
        onUpdate(response.data);
      }

      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile data:", error);
    }
  };

  const handleBroadcast = () => {
    // 여기에 방송하기 로직을 추가하세요
  };

  const handleChange = (field, value) => {
    setEditData({
      ...editData,
      [field]: value,
    });
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Card>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Avatar sx={{ mr: 2 }} src={isEditing ? editData.image : profile.image} />
              <Typography variant="h5">{isEditing ? editData.name : profile.name}</Typography>
            </Box>
            {showEditButton && (
              <Button variant="outlined" color="primary" onClick={isEditing ? handleSave : handleEdit}>
                {isEditing ? "Save" : "Edit"}
              </Button>
            )}
            <Button variant="outlined" color="secondary" onClick={handleBroadcast}>
              방송하기
            </Button>
          </Box>
          <Divider sx={{ my: 2 }} />
          {isEditing ? (
            <>
              <TextField
                fullWidth
                label="Name"
                value={editData.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
              <TextField
                fullWidth
                label="Phone Number"
                value={editData.phoneNumber}
                onChange={(e) => handleChange("phoneNumber", e.target.value)}
              />
              <TextField
                fullWidth
                label="Location"
                value={editData.location}
                onChange={(e) => handleChange("location", e.target.value)}
              />
              <TextField
                fullWidth
                label="Site URL"
                value={editData.siteUrl}
                onChange={(e) => handleChange("siteUrl", e.target.value)}
              />
              <TextField
                fullWidth
                label="Image URL"
                value={editData.image}
                onChange={(e) => handleChange("image", e.target.value)}
              />
              <TextField
                fullWidth
                type="password"
                label="Password"
                onChange={(e) => handleChange("password", e.target.value)}
              />
            </>
          ) : (
            <>
              <Typography variant="subtitle1" color="text.secondary" component="div">
                임시 프로필 번호: {profile.shelterNo}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" component="div">
                연락처: {profile.phoneNumber}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" component="div">
                지역: {profile.location}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" component="div">
                사이트: {profile.siteUrl}
              </Typography>
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default ProfileCard;
