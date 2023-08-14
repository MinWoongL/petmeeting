import React, { useEffect, useState } from "react";
import {
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Avatar,
  Box,
} from "@mui/material";

import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useNavigate, useLocation } from "react-router-dom";
// 로그인창 토글 버튼 임포트
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

import { useDispatch, useSelector } from "react-redux";
import {
  setPassword as setReduxPassword,
  login,
} from "../../stores/Slices/UserSlice";
import { Link } from "react-router-dom";
import axios from "axios";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

export default function Login() {
  const [id, setId] = useState(""); // ID 상태
  const [password, setPassword] = useState(""); // 비밀번호 상태
  //   const dispatch = useDispatch(); // Redux dispatch 사용
  const user = useSelector((state) => state.user);
  const [userType, setUserType] = useState("user"); // 사용자 타입 상태

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  //네비게이션 로직

  const handleUserTypeChange = (event, newUserType) => {
    setUserType(newUserType);
  };
  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  //   const user = useSelector((state) => state.user);

  useEffect(() => {
    console.log(user);
  }, [user]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const userId = data.get("id");
    const password = data.get("password");

    try {
      const response = await axios({
        method: "post",
        url: "https://i9a203.p.ssafy.io/backapi/api/v1/user/sign-in",
        headers: { "Content-Type": "application/json" },
        data: JSON.stringify({ userId, password }),
      });

      if (response.status === 200) {
        dispatch(
          login({
            userId: response.data.name,

            points: response.data.holdingPoint,
            tokens: response.data.holdingToken,
            imagePath: response.data.imagePath,
            isAdopted: response.data.adopted,
          })
        ); // 로그인 상태로 설정

        if (response.headers["token"]) {
          // Store JWT token in session storage
          sessionStorage.setItem("token", response.headers["token"]);
        } else {
          console.log("No token found in response");
        }

        console.log(response);
        // Create new user object
        const newUser = {
          userNo: response.data.userNo,
          name: response.data.name,
          userType: response.data.userGroup, // Add userType
          isAdopted: response.data.adopted,
          imagePath: response.data.imagePath,
          points: response.data.holdingPoint,
          tokens: response.data.holdingToken,
        };

        // Save the new user object to localStorage
        localStorage.setItem("user", JSON.stringify(newUser));

        // navigate("/"); // Home으로 이동
        navigate(location.state?.from || "/");
      } else {
        console.log("Login failed");
      }
    } catch (error) {
      console.error("Error occurred during login:", error);
      console.log(error.response, "에러리스폰스");
      if (error.response.data.message.includes("가입")) {
        setSnackbarMessage(
          "아이디가 존재하지 않습니다. 회원 가입 후 이용 해 주세요."
        );
      } else if (error.response.data.message.includes("비밀")) {
        setSnackbarMessage("비밀번호가 일치하지 않습니다.");
      } else {
        setSnackbarMessage("오류가 발생했습니다. 다시 시도해주세요");
      }
      setOpenSnackbar(true);
    }
  };
  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      style={{ height: "100vh" }}
    >
      <Grid item xs={11} md={4}>
        <Paper elevation={3} style={{ padding: "20px" }}>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            marginBottom={2}
          >
            <Avatar style={{ backgroundColor: "transparent" }}>
              <img
                src="/puppy_icon.ico"
                alt="puppy icon"
                style={{ width: "100%", height: "auto" }}
              />
              {/* <LockOutlinedIcon /> */}
            </Avatar>
            <Typography variant="h5" style={{ marginTop: "12px" }}>
              Login
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <ToggleButtonGroup
              value={userType}
              exclusive
              onChange={handleUserTypeChange}
              style={{ marginBottom: "15px" }}
            >
              <ToggleButton value="사용자">사용자</ToggleButton>
              <ToggleButton value="보호소">보호소</ToggleButton>
            </ToggleButtonGroup>

            <TextField
              fullWidth
              label="ID"
              variant="outlined"
              margin="normal"
              value={id}
              name="id"
              onChange={(e) => setId(e.target.value)}
              InputProps={{
                startAdornment: <LockOutlinedIcon />,
              }}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              name="password"
              variant="outlined"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: <LockOutlinedIcon />,
              }}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              style={{ marginTop: "15px" }}
            >
              로그인
            </Button>
          </form>
          <Link to="/signup">
            <Button
              variant="text"
              color="primary"
              fullWidth
              style={{ marginTop: "10px" }}
              // 회원가입 모달을 여는 함수나 회원가입 페이지로 이동하는 로직을 여기에 넣으세요.
            >
              회원가입
            </Button>
          </Link>
          <Snackbar
            open={openSnackbar}
            autoHideDuration={6000}
            onClose={handleSnackbarClose}
          >
            <MuiAlert
              onClose={handleSnackbarClose}
              severity="error"
              elevation={6}
              variant="filled"
            >
              {snackbarMessage}
            </MuiAlert>
          </Snackbar>
        </Paper>
      </Grid>
    </Grid>
  );
}
