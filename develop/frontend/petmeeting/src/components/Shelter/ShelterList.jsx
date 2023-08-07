import React from "react";
import { Box, Card, CardContent, CardMedia, Typography } from "@mui/material";

const ProfileCard = ({ profile, isEditing, onChange }) => {
  if (isEditing) {
    return (
      <Box sx={{ border: "1px solid black" }}>
        <Card sx={{ display: "flex" }}>
          <CardContent sx={{ flex: "1 0 auto" }}>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => onChange("name", e.target.value)}
            />
            <input
              type="text"
              value={profile.phoneNumber}
              onChange={(e) => onChange("phoneNumber", e.target.value)}
            />
            <input
              type="text"
              value={profile.location}
              onChange={(e) => onChange("location", e.target.value)}
            />
            <input
              type="text"
              value={profile.siteUrl}
              onChange={(e) => onChange("siteUrl", e.target.value)}
            />
            <input
              type="text"
              value={profile.image}
              onChange={(e) => onChange("image", e.target.value)}
            />
          </CardContent>
        </Card>
      </Box>
    );
  } else {
    return (
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
            // imagePath
            image={profile.image}
            alt={profile.name}
          />
        </Card>
      </Box>
    );
  }
};
export default ProfileCard;
