// src/components/MainPage.js
import React from "react";
import BroadCastingMain from "../components/Main/BroadCastingMain";
import BroadCastingSub from "../components/Main/BroadCastingSub";
import { Typography, Box } from "@mui/material";

function MainPage() {
  return (
    <Box
      sx={{
        mt: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography component="h1" variant="h5">
        Home
      </Typography>
      <Box component="div" noValidate sx={{ mt: 1 }}>
        <Typography component="p"></Typography>
      </Box>
      {/* 방송중메인영역 */}
      <BroadCastingMain />
      {/* sub방송중페이지영역 */}
      <BroadCastingSub />
      <BroadCastingSub />
    </Box>
  );
}

export default MainPage;
