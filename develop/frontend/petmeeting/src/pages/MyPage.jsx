import React, { useState, useEffect } from "react";
import { Typography, Box } from "@mui/material";
import { useSelector } from "react-redux";
import { UserInformation } from "../components/MyPage/UserInformation";

function Adoption() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

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
        <Typography component="p">
          Welcome to the {user ? user.name : "Guest"} page!
        </Typography>
      </Box>

      {/* 마이페이지 메인 박스 */}

      <UserInformation>123</UserInformation>
    </Box>
  );
}

export default Adoption;
