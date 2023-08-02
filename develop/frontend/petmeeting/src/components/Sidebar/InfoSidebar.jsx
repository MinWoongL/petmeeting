// 일반, 보호소 유저에 따라 항목 다르게 보이도록
import React, { useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  Avatar,
  Box,
  Typography,
  Button,
  Stack,
  TextField,
  Card,
  CardContent,
  IconButton,
  Snackbar,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import EditIcon from "@mui/icons-material/Edit";
import { logout, updateNickName } from "../../stores/Slices/UserSlice";

function InfoSidebar() {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [nicknameInput, setNicknameInput] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleSnackbarClose = (event, reason) => {
    console.log("Snackbar is closing due to:", reason);
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  const Logout = async () => {
    try {
      // This is just an example endpoint and might be different in your application.
      const token = JSON.parse(sessionStorage.getItem("token"));
      console.log(token.accessToken);
      // Create the header
      const config = {
        headers: { AccessToken: `Bearer ${token.accessToken}` },
      };
      console.log("header야", config.headers);
      const response = await axios.delete(
        "https://i9a203.p.ssafy.io/backapi/api/v1/user/sign-out",

        {
          headers: { AccessToken: `Bearer ${token.accessToken}` },
        }
      );
      console.log("실패하는거지?");
      // If the request is successful, remove the user data and token from local and session storage.
      if (response.status === 200) {
        dispatch(logout());
        localStorage.removeItem("user");
        sessionStorage.removeItem("token");
        setOpenSnackbar(true);
        navigate("/");
      }
    } catch (error) {
      console.error("Failed to logout:", error);
      setOpenSnackbar(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateNickName(nicknameInput));
  };
  if (!user.isLoggedIn) {
    return (
      <Card variant="outlined" style={{ width: "100%", height: "100%" }}>
        <CardContent>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
          >
            <img
              src="https://png.pngtree.com/element_origin_min_pic/16/05/28/18574977d4e06ba.jpg"
              alt="Default avatar"
              style={{
                width: "150px",
                height: "150px",
                borderRadius: "50%",
                marginBottom: "20px",
              }}
            />
            <Typography variant="h6">Guest</Typography>
            <Box mt={3} width="100%">
              <Button
                variant="contained"
                color="primary"
                fullWidth
                component={Link}
                to="/login"
              >
                로그인
              </Button>
            </Box>
          </Box>
        </CardContent>
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
        >
          <MuiAlert
            onClose={handleSnackbarClose}
            severity="success"
            elevation={6}
            variant="filled"
          >
            로그아웃이 완료 되었습니다!
          </MuiAlert>
        </Snackbar>
      </Card>
    );
  }

  return (
    <Card variant="outlined" style={{ width: "100%", height: "100%" }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Avatar
            src={user.avatarUrl}
            alt="User avatar"
            style={{ width: "80px", height: "80px", marginRight: "20px" }}
          />

          <Box>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="h6">{user.userId}</Typography>
              <IconButton size="small" onClick={() => setIsEditing(!isEditing)}>
                <EditIcon fontSize="small" />
              </IconButton>
            </Stack>
            <Typography variant="body2">내 포인트: {user.points}</Typography>
          </Box>
        </Box>

        {isEditing && (
          <form
            onSubmit={handleSubmit}
            style={{ width: "100%", marginTop: "20px" }}
          >
            <TextField
              variant="outlined"
              size="small"
              fullWidth
              label="Change Nickname"
              value={nicknameInput}
              onChange={(e) => setNicknameInput(e.target.value)}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              style={{ marginTop: "10px", width: "100%" }}
            >
              Save
            </Button>
          </form>
        )}

        <Box mt={3} width="100%">
          <Button
            variant="contained"
            color="primary"
            fullWidth
            component={Link}
            to="/mypage"
          >
            마이페이지
          </Button>
          <Button
            variant="outlined"
            fullWidth
            style={{ marginTop: "10px" }}
            onClick={Logout}
          >
            로그아웃
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

export default InfoSidebar;
