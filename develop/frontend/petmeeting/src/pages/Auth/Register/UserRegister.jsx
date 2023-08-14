import * as React from "react";
import axios from "axios";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import RegisterImageUploadButton from "../../../components/Button/RegisterImageUploadButton";

import "../../../styles/base.css";
import {
  setPassword as setReduxPassword,
  login,
} from "../../../stores/Slices/UserSlice";
import { useNavigate } from "react-router";

import { useDispatch, useSelector } from "react-redux";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const defaultTheme = createTheme();

export default function SignUp() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userType, setUserType] = React.useState("사용자");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [passwordError, setPasswordError] = React.useState(false);
  const [userIdAvailable, setUserIdAvailable] = React.useState(null);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [imagePath, setImagePath] = React.useState("");

  const [selectedProfileImage, setSelectedProfileImage] = React.useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = React.useState(false);

  const profileImages = [
    `https://i9a203.p.ssafy.io/backapi/api/v1/image/profile1.png?option=member`,
    `https://i9a203.p.ssafy.io/backapi/api/v1/image/profile2.png?option=member`,
    `https://i9a203.p.ssafy.io/backapi/api/v1/image/profile3.png?option=member`,
    `https://i9a203.p.ssafy.io/backapi/api/v1/image/profile4.png?option=member`,
    `https://i9a203.p.ssafy.io/backapi/api/v1/image/profile5.png?option=member`,
    `https://i9a203.p.ssafy.io/backapi/api/v1/image/profile6.png?option=member`,
  ];

  const handleProfileModalOpen = () => {
    setIsProfileModalOpen(true);
  };

  const handleProfileModalClose = () => {
    setIsProfileModalOpen(false);
  };

  const handleProfileImageSelect = (image, index) => {
    setSelectedProfileImage(image);
    setIsProfileModalOpen(false);
    setImagePath(`profile${index + 1}.png`);
  };

  const handleSnackbarOpen = () => {
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbarOpen(false);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
    setPasswordError(event.target.value !== password);
  };

  const handleChange = (event) => {
    setUserType(event.target.value);
  };
  const handleUserTypeChange = (event, newUserType) => {
    setUserType(newUserType);
  };

  const handleUserIdCheck = async (userId) => {
    try {
      const response = await axios.get(
        `https://i9a203.p.ssafy.io/backapi/api/v1/user/check/${userId}`
      );
      console.log(response.data.result);

      if (!response.data.result) {
        console.log("들어왔음");
        // alert("아이디가 이미 사용중입니다.");

        setUserIdAvailable(false);
      } else {
        handleSnackbarOpen(); // 스낵바 열기
        setUserIdAvailable(true);
      }
    } catch (error) {
      console.log("중복!");
      setUserIdAvailable(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.target);

    try {
      console.log(userType);

      let postData = {
        userId: data.get("userId"),
        password: data.get("password"),
        name: data.get("name"),
        phoneNumber: data.get("phoneNumber"),
        userGroup: userType,
        imagePath: imagePath,
      };

      // If the user type is not "사용자", add additional fields
      if (userType !== "사용자") {
        postData = {
          ...postData,
          location: data.get("location"),
          siteUrl: data.get("siteUrl"),
          registImagePath: imagePath,
        };
        console.log(postData);
      }
      const response = await axios.post(
        "https://i9a203.p.ssafy.io/backapi/api/v1/user/sign-up",
        postData
      );

      if (response.status === 201) {
        console.log("회원가입 성공!");
        const userId = data.get("userId");
        const password = data.get("password");

        // console.log(userId, password, "아이디 패스워드");

        // 보호소에서 회원가입이 오는 경우에는 회원 가입이 됐는데 로그인이 안되는 경우

        try {
          // console.log("들어는 오지?", userId, password);
          const loginResponse = await axios({
            method: "post",
            url: "https://i9a203.p.ssafy.io/backapi/api/v1/user/sign-in",
            headers: { "Content-Type": "application/json" },
            data: JSON.stringify({ userId, password }),
          });

          const newUser = {
            userNo: loginResponse.data.userNo,
            name: loginResponse.data.name,
            userType: userType, // Add userType
          };

          // Save the new user object to localStorage
          localStorage.setItem("user", JSON.stringify(newUser));

          // console.log("axios 로직에서 터지나?1");
          if (loginResponse.status === 200) {
            console.log("로그인 성공!");
            dispatch(
              login({
                userId: loginResponse.data.name,
                points: loginResponse.data.points,
              })
            ); // 로그인 상태로 설정

            if (loginResponse.headers["token"]) {
              // Store JWT token in session storage
              sessionStorage.setItem("token", loginResponse.headers["token"]);
            } else {
              console.log("No token found in response");
            }

            // If there is no user object in localStorage, create one
            if (!localStorage.getItem("user")) {
              localStorage.setItem("user", JSON.stringify({}));
            }

            // Retrieve the user object from localStorage
            const localStorageUser = JSON.parse(localStorage.getItem("user"));

            // Update the user object with the new name
            localStorageUser.name = loginResponse.data.name;

            // Save the updated user object back to localStorage
            localStorage.setItem("user", JSON.stringify(localStorageUser));

            navigate("/"); // Home으로 이동
          } else {
            console.log("Login failed");
          }
        } catch (error) {
          console.error("에러 발생 : ", error);
        }
      }
    } catch (error) {
      console.log();
      console.error("Signup failed:", error);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            회원 가입
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <ToggleButtonGroup
                  color="primary"
                  value={userType}
                  exclusive
                  onChange={handleUserTypeChange}
                >
                  <ToggleButton value="사용자">사용자</ToggleButton>
                  <ToggleButton value="보호소">보호소</ToggleButton>
                </ToggleButtonGroup>
              </Grid>
              <Grid item xs={12} align="center">
                <label>
                  <h3>프로필 사진을 골라주세요</h3>
                </label>
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    display: "flex",
                    justifyContent: "center",
                    margin: "30px",
                  }}
                >
                  <Avatar
                    src={selectedProfileImage}
                    sx={{ width: 70, height: 70, cursor: "pointer" }}
                    onClick={handleProfileModalOpen}
                  />
                </div>
              </Grid>

              <Dialog
                open={isProfileModalOpen}
                onClose={handleProfileModalClose}
                aria-labelledby="profile-dialog-title"
              >
                <DialogTitle id="profile-dialog-title">
                  프로필 사진 선택
                </DialogTitle>
                <DialogContent>
                  <Grid container spacing={2}>
                    {profileImages.map((image, index) => (
                      <Grid item xs={4} key={index} align="center">
                        <Avatar
                          src={image}
                          sx={{ width: 50, height: 50, cursor: "pointer" }}
                          onClick={() => handleProfileImageSelect(image, index)}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleProfileModalClose} color="primary">
                    닫기
                  </Button>
                </DialogActions>
              </Dialog>

              <Grid container spacing={2}>
                <Grid item container xs={12} alignItems="center">
                  <Grid item xs={9}>
                    <TextField
                      required
                      fullWidth
                      id="userId"
                      label="아이디"
                      name="userId"
                      autoComplete="username"
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <Button
                      onClick={() =>
                        handleUserIdCheck(
                          document.getElementById("userId").value
                        )
                      }
                      variant="contained"
                      color="primary"
                      sx={{
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      중복확인
                    </Button>
                  </Grid>
                </Grid>
                {userIdAvailable === false && (
                  <Typography variant="body2" color="error">
                    아이디가 이미 사용 중입니다.
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="비밀번호"
                  type="password"
                  id="password"
                  onChange={handlePasswordChange}
                  autoComplete="new-password"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="confirmPassword"
                  label="비밀번호 확인"
                  type="password"
                  id="confirmPassword"
                  onChange={handleConfirmPasswordChange}
                  error={passwordError}
                  helperText={
                    passwordError ? "비밀번호가 일치하지 않습니다." : ""
                  }
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="name"
                  label="닉네임"
                  name="name"
                  autoComplete="name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="phoneNumber"
                  label="전화번호"
                  name="phoneNumber"
                />
              </Grid>
              {userType === "보호소" && (
                <>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="location"
                      label="주소"
                      name="location"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="siteUrl"
                      label="홈페이지 주소"
                      name="siteUrl"
                    />
                  </Grid>
                  <></>
                  <Grid item xs={12}>
                    <RegisterImageUploadButton
                      option="shelter"
                      setImagePath={setImagePath}
                    />
                  </Grid>
                </>
              )}
              {/* <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox value="allowExtraEmails" color="primary" />
                  }
                  label="I want to receive inspiration, marketing promotions and updates via email."
                />
              </Grid> */}
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              회원 가입
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/login" variant="body2">
                  이미 회원이십니까? 로그인 하러 가기
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity="success">
          회원가입 가능한 아이디입니다!
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}
