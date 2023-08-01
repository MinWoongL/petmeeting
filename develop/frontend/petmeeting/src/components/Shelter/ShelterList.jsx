import React from "react";
import { Card, CardContent, CardMedia, Typography } from "@mui/material";

const ProfileCard = ({ profile }) => {
  return (
    <Card sx={{ display: "flex" }}>
      <CardContent sx={{ flex: "1 0 auto" }}>
        <Typography component="div" variant="h5">
          {profile.name}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" component="div">
          전화번호 : {profile.address} 전화번호
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" component="div">
          이메일 : {profile.email} 이메일
        </Typography>
        <Typography variant="body2" color="text.secondary" component="div">
          사이트 : {profile.url} 사이트
        </Typography>
      </CardContent>
      <CardMedia
        component="img"
        sx={{ width: 151 }}
        image={profile.image}
        alt={profile.name}
      />
    </Card>
  );
};

export default ProfileCard;
