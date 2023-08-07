import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  TextField,
} from "@mui/material";
import axios from "axios";

const ProfileCard = ({ profile, onChange, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(profile);

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (field, value) => {
    setEditData({
      ...editData,
      [field]: value,
    });
  };

  const handleSave = async () => {
    // Call the API to update the profile
    const token = JSON.parse(sessionStorage.getItem("token"));
    const { shelterNo, joinDate, image, ...dataToSend } = editData;
    try {
      console.log(dataToSend);
      await axios.put(
        "https://i9a203.p.ssafy.io/backapi/api/v1/user",
        dataToSend,
        {
          headers: { AccessToken: `Bearer ${token.accessToken}` },
        }
      );
      if (typeof onUpdate === "function") {
        onUpdate(editData);
      }

      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile data:", error);
    }
  };

  return isEditing ? (
    <Box sx={{ border: "1px solid black" }}>
      <Card sx={{ display: "flex" }}>
        <CardContent sx={{ flex: "1 0 auto" }}>
          <TextField
            label="Name"
            value={editData.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
          <TextField
            label="Phone Number"
            value={editData.phoneNumber}
            onChange={(e) => handleChange("phoneNumber", e.target.value)}
          />
          <TextField
            label="Location"
            value={editData.location}
            onChange={(e) => handleChange("location", e.target.value)}
          />
          <TextField
            label="Site URL"
            value={editData.siteUrl}
            onChange={(e) => handleChange("siteUrl", e.target.value)}
          />
          <TextField
            label="Image URL"
            value={editData.image}
            onChange={(e) => handleChange("image", e.target.value)}
          />
          <TextField
            type="password"
            label="Password"
            onChange={(e) => handleChange("password", e.target.value)}
          />
        </CardContent>
      </Card>
      <Button onClick={handleSave}>Save</Button>
    </Box>
  ) : (
    <Box sx={{ border: "1px solid black" }}>
      <Card sx={{ display: "flex" }}>
        <CardContent sx={{ flex: "1 0 auto" }}>
          <Typography component="div" variant="h5">
            {profile.name}
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            component="div"
          >
            임시 프로필 번호: {profile.shelterNO}
            전화번호 : {profile.phoneNumber} 전화번호
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            component="div"
          >
            지역 : {profile.location} 이메일
          </Typography>
          <Typography variant="body2" color="text.secondary" component="div">
            사이트 : {profile.siteUrl} 사이트
          </Typography>
        </CardContent>
        <CardMedia
          component="img"
          sx={{ width: 151 }}
          image={profile.image}
          alt={profile.name}
        />
      </Card>
      <Button onClick={handleEdit}>Edit</Button>
    </Box>
  );
};
export default ProfileCard;
