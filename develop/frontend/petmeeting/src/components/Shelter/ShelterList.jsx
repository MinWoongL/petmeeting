import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  TextField,
  Grid,
  Pagination
} from "@mui/material";
import axios from "axios";
import { config } from "../../static/config";

const ProfileCard = ({ profile, onChange, onUpdate, showEditButton }) => {
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

  const cardMedia = (
    <CardMedia
      component="img"
      sx={{ width: 151 }}
      src={
        config.baseURL +
        "/api/v1/image/" +
        profile.imagePath +
        "?option=shelter"
      }
      image={isEditing ? editData.image : profile.image}
      alt={isEditing ? editData.name : profile.name}
    />
  );

  return (
    <Box
      sx={{
        border: "1px solid black",
        backgroundColor: "var(--yellow8)", // Set background color to yellow8
        margin: "16px", // Add margin bottom
      }}
    >
      <Card
        sx={{
          display: "flex",
          flexDirection: "row",
          minHeight: "200px", // Set minimum height for the card
        }}
      >
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
                  label="Site URL"
                  value={editData.siteUrl}
                  onChange={(e) => handleChange("siteUrl", e.target.value)}
                />
              </Box>
              <Box>
                <TextField
                  label="Image URL"
                  value={editData.image}
                  onChange={(e) => handleChange("image", e.target.value)}
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
                {/* 임시 프로필 번호: {profile.shelterNO} */}
                전화번호 : {profile.phoneNumber} 
              </Typography>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                component="div"
              >
                지역 : {profile.location} 
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                component="div"
              >
                사이트 : {profile.siteUrl}
              </Typography>
            </>
          )}
        </CardContent>
        {cardMedia}
      </Card>
      {isEditing ? (
        <Button onClick={handleSave}>Save</Button>
      ) : (
        showEditButton && <Button onClick={handleEdit}>123Edit</Button>
      )}
    </Box>
  );
};

export default ProfileCard;
