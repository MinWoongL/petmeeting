// 일반, 보호소 유저에 따라 항목 다르게 보이도록
import React, { useState, useEffect } from "react";
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
  const [holdingPoint, setHoldingPoint] = useState(0);
  const [holdingToken, setHoldingToken] = useState(0);
  const handleMyPageClick = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user.userType === "보호소") {
      navigate("/mypage/ShelterMypage");
    } else if (user.userType === "사용자" || user.userType === "user") {
      navigate("/mypage");
    }
  };

  useEffect(() => {
    // Define the async function inside the useEffect
    const fetchHoldingData = async () => {
      try {
        const token = JSON.parse(sessionStorage.getItem("token"));
        const config = {
          headers: { AccessToken: `Bearer ${token.accessToken}` },
        };

        // Replace the API endpoints with the actual endpoints of your backend
        const responsePoint = await axios.get(
          "https://i9a203.p.ssafy.io/backapi/api/v1/user",
          config
        );

        console.log(responsePoint.data);
        // Assuming that the data returned from your API is in the "data" property of the response object
        setHoldingPoint(responsePoint.data.holdingPoint);
        setHoldingToken(responsePoint.data.holdingToken);
      } catch (error) {
        console.error("Failed to fetch holding data:", error);
      }
    };

    // Call the async function
    fetchHoldingData();
  }, []);

  const [nicknameInput, setNicknameInput] = useState("");

  const [openSnackbar, setOpenSnackbar] = useState(false);

  let image = user?.imagePath ? user.imagePath : "profile2.png";

  const imagePath = `https://i9a203.p.ssafy.io/backapi/api/v1/image/${image}?option=member`;

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
      // Create the header
      const config = {
        headers: { AccessToken: `Bearer ${token.accessToken}` },
      };
      const response = await axios.delete(
        "https://i9a203.p.ssafy.io/backapi/api/v1/user/sign-out",

        {
          headers: { AccessToken: `Bearer ${token.accessToken}` },
        }
      );
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
              src={user.avatarUrl}
              alt="Default avatar"
              style={{
                width: "150px",
                height: "150px",
                borderRadius: "50%",
                marginBottom: "20px",
              }}
            />
            <Typography variant="h6">Guest</Typography>
            <div style={{ display: "flex", gap: "12px", marginTop: "10px" }}>
              <Button
                variant="contained"
                style={{
                  backgroundColor: "var(--yellow9)",
                  fontWeight: "bold",
                }}
                component={Link}
                to="/login"
              >
                로그인
              </Button>
              <Button
                variant="contained"
                style={{
                  backgroundColor: "var(--yellow9)",
                  fontWeight: "bold",
                }}
                component={Link}
                to="/signup"
              >
                회원가입
              </Button>
            </div>
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
            src={imagePath}
            alt="User avatar"
            style={{ width: "80px", height: "80px", marginRight: "20px" }}
          />

          <Box>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography
                variant="h5"
                sx={{ fontFamily: "Jua", fontWeight: "bold" }}
              >
                {user.userId}
              </Typography>
            </Stack>
            <Typography
              variant="body2"
              sx={{ fontFamily: "Jua", fontWeight: "normal" }}
            >
              {/* 내 포인트: {user.holdingPoint ? user.holdingPoint : 0} */}내
              포인트: {holdingPoint ? holdingPoint : 0}
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontFamily: "Jua", fontWeight: "normal" }}
            >
              내 멍코인: {holdingToken ? holdingToken : 0}
            </Typography>
          </Box>
        </Box>

        <Box mt={3} width="100%">
          <Button
            variant="contained"
            // color="primary"
            fullWidth
            // style = {{backgroundColor: '#b9a178'}}
            style={{ backgroundColor: "var(--yellow9)", fontWeight: "bold" }}
            onClick={handleMyPageClick}
          >
            마이페이지
          </Button>
          <Button
            variant="outlined"
            fullWidth
            // style={{ marginTop: "10px", backgroundColor: '#b9a178' }}
            style={{
              marginTop: "10px",
              backgroundColor: "var(--yellow9)",
              color: "white",
              fontWeight: "bold",
            }}
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
