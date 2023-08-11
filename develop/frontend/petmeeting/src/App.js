import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useLocation,
  Switch
} from "react-router-dom";
import { Provider, useSelector, useDispatch } from "react-redux";
import store from "./stores/index";
import { login } from "./stores/Slices/UserSlice";
import {
  AppBar,
  Button,
  Typography,
  Grid,
  Box,
  Menu,
  MenuItem,
  Hidden,
  Toolbar,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MainPage from "./pages/MainPage";
import ShelterPage from "./pages/Shelter";
import ShelterDetailPage from "./pages/ShelterDetail";
import RegisterDog from "./pages/RegisterDog";
import AdoptionPage from "./pages/Adoption";
import AdoptionReviewBoard from "./pages/Board/AdoptionReviewBoard";
import InquiryBoard from "./pages/Board/InquiryBoard";
import UsageGuide from "./pages/Board/UsageGuide";
import DogDetailPage from "./pages/DogDetailPage";

import UserDetail from "./pages/MyPage/UserMyPage/UserDetail";
import ShelterMyPage from "./pages/MyPage/ShelterMyPage/ShelterMyPage";
import LogIn from "./pages/Auth/LogIn";
import UserRegister from "./pages/Auth/Register/UserRegister";
import InfoSidebar from "./components/Sidebar/InfoSidebar";
import RankSystemSidebar from "./components/Sidebar/RankSystemSidebar";
import ChatSidebar from "./components/Sidebar/ChatSidebar";

import BroadCastingPage from "./pages/BroadCasting";
import "./styles/base.css";

import TokenRefresher from "./apis/refresher";
import AdoptionReviewMain from "./components/Board/AdoptionReviewMain";
import AdoptionReviewCreate from "./components/Board/AdoptionReviewCreate";

import InquiryMain from "./components/Board/InquiryMain";
import InquiryCreate from "./components/Board/InquiryCreate";

import ApplicationForm from "./components/Adoption/ApplicationForm";

import PetMeetingLogo1 from "./assets/images/petmeeting_logo1.png";
import PetMeetingLogo2 from "./assets/images/petmeeting_logo2.png";

import LoadingMain from "./components/loading/LoadingMain";


function NavBar({ isLoggedIn }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorEl2, setAnchorEl2] = useState(null);

  // 로그인 토글 기능
  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const user = JSON.parse(localStorage.getItem("user"));
  const userType = user ? user.usertype : null;
  const handleClose = () => {
    setAnchorEl(null);
  };

  // 게시글 토글 기능
  const handleOpenBoard = (event) => {
    setAnchorEl2(event.currentTarget);
  };
  const handleCloseBoard = () => {
    setAnchorEl2(null);
  };

  return (
    <AppBar
      position="static"
      className="theme-blueberry"
      style={{ backgroundColor: "var(--dark)" }}
    >
      <TokenRefresher />
      <Toolbar>
        <Link
          to="/"
          style={{ textDecoration: "none", color: "inherit", flexGrow: 1 }}
        >
          <Typography variant="h6" component="div">
             <img src={PetMeetingLogo1} alt="Pet Meeting Logo" style={{ maxHeight: "40px", marginTop: "9px" }} />
          </Typography>
        </Link>
        <Button color="inherit" component={Link} to="/">
          Home
        </Button>
        <Button color="inherit" component={Link} to="/shelter">
          보호소
        </Button>
        <Button color="inherit" component={Link} to="/adoption">
          입양하기
        </Button>
        <>
          <Button color="inherit" onClick={handleOpenBoard}>
            게시판
          </Button>
          <Menu
            anchorEl={anchorEl2}
            open={Boolean(anchorEl2)}
            onClose={handleCloseBoard}
          >
            <MenuItem
              onClick={handleCloseBoard}
              component={Link}
              to="/board/adoption-review"
            >
              입양후기
            </MenuItem>
            <MenuItem
              onClick={handleCloseBoard}
              component={Link}
              to="/board/inquiry"
            >
              문의게시판
            </MenuItem>
            <MenuItem
              onClick={handleCloseBoard}
              component={Link}
              to="/board/usage-guide"
            >
              이용방법
            </MenuItem>
          </Menu>
        </>
        {isLoggedIn ? (
          <>
            {userType === "보호소" ? (
              <Button
                color="inherit"
                component={Link}
                to="/mypage/ShelterMyPage"
              >
                보호소 마이페이지
              </Button>
            ) : (
              <Button color="inherit" component={Link} to="/mypage">
                마이페이지
              </Button>
            )}
          </>
        ) : (
          <>
            <Button color="inherit" onClick={handleOpen}>
              <AccountCircleIcon /> {/* 사람모양 아이콘 */}
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose} component={Link} to="/login">
                로그인
              </MenuItem>
              <MenuItem onClick={handleClose} component={Link} to="/signup">
                회원가입
              </MenuItem>
            </Menu>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

function App() {
  const location = useLocation();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  const [loading, setLoading] = useState(false); // 유녕추가

  // 현재 경로가 보호소 상세 페이지인지 확인
  const isShelterDetailPage = location.pathname.startsWith("/shelter/");

  // useEffect(() => {
  //   setLoading(true);
  //   setTimeout(() => {
  //     setLoading(false);
  //   }, []);
  // }) d유녕유녕

  useEffect(() => {
    const token = sessionStorage.getItem("token");

    if (token) {
      const user = localStorage.getItem("user");
      const userData = JSON.parse(user);
      dispatch(login({ userId: userData.name }));
    }
  }, [dispatch]);

  const authPage = ["/signup", "/login"];
  const pageCheck = authPage.includes(location.pathname);

  const backgroundColor = pageCheck ? "var(--yellow1)" : "var(--yellow2)";

  const shelterNoMatch = location.pathname.match(/\/shelter\/(\d+)/);
  const shelterNo = shelterNoMatch ? shelterNoMatch[1] : null;

  return (
    <>
      <div
        className="theme-yellow"
        style={{
          minHeight: "180vh",
          height: "100%",
          backgroundColor: "var(--yellow3)",
          overflowYL: "auto",
        }}
      >
        <NavBar isLoggedIn={isLoggedIn} />

        <Grid container spacing={2} style={{ height: "calc(100% - 64px)" }}>
          <Hidden smDown>
            {/* 로그인 또는 회원가입 페이지가 아니면 왼쪽 영역을 표시 */}
            {!pageCheck && (
              <Grid
                item
                xs={3}
                style={{ maxHeight: "calc(100vh - 64px)", borderRadius: "8px" }}
              >
                {" "}
                {/* 왼쪽 3칸 */}
                <Box border="none" height="100%" >
                  <Grid
                    container
                    direction="column"
                    wrap="nowrap"
                    style={{ height: "100%" }}
                  >
                    <Grid item style={{ flex: 2 }}>
                      <Box
                        marginTop="10px"
                        marginLeft="10px"
                        border={1}
                        borderColor="transparent"
                        height="100%"
                      >
                        <InfoSidebar />
                      </Box>
                    </Grid>

                    <Grid item style={{ flex: 3 }} sx={{ mt: 2 }}>
                      <Box
                        marginTop="10px"
                        marginLeft="10px"
                        border={1}
                        borderColor="transparent"
                        height="100%"
                        style={{
                          backgroundColor: "var(--yellow6)",
                          borderRadius: "8px",
                          marginBottom: "18px"
                        }}
                      >
                        {shelterNo ? (
                          <ChatSidebar shelterNo={shelterNo} />
                        ) : (
                          <RankSystemSidebar />
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            )}
          </Hidden>

          <Grid item xs={pageCheck ? 12 : 9}>
            {" "}
            {/* 로그인 또는 회원가입 페이지이면 전체 영역, 아니면 오른쪽 9칸 */}
            <Box
              border={1}
              borderColor="transparent"
              minHeight="85vh"
              height="100%"
              style={{ backgroundColor: "var(--yellow)" }}
            >
              <Routes>
                <Route path="/" exact element={<MainPage />} />

                <Route path="/register-dog" element={<RegisterDog />} />
                <Route path="/shelter" element={<ShelterPage />} />
                <Route
                  path="/shelter/:shelterNo"
                  element={<ShelterDetailPage />}
                />
                <Route path="/adoption" element={<AdoptionPage />} />

                <Route
                  path="/board/adoption-review"
                  element={<AdoptionReviewBoard />}
                />
                <Route path="/board/inquiry" element={<InquiryBoard />} />
                <Route path="/board/usage-guide" element={<UsageGuide />} />

                <Route path="/mypage" element={<UserDetail />} />
                <Route
                  path="/Mypage/ShelterMyPage"
                  element={<ShelterMyPage />}
                />
                <Route path="/login" element={<LogIn />} />
                <Route path="/signup" element={<UserRegister />} />
                <Route path="/dog/:dogId" element={<DogDetailPage />} />
                <Route
                  path="/broadcasting/:broadcastId"
                  element={<BroadCastingPage />}
                ></Route>
                <Route
                  path="/board/adoption-review/:boardNo" // URL 파라미터를 사용하는 경로로 변경
                  element={<AdoptionReviewMain />} // AdoptionReviewMain 컴포넌트 렌더링
                />
                <Route
                  path="/board/adoption-review/cr"
                  element={<AdoptionReviewCreate />}
                />

                <Route
                  path="/board/inquiry/cr"
                  element={<InquiryCreate />}
                />
                <Route
                  path="/board/inquiry/:inquiryNo"
                  element={<InquiryMain />}
                />

                <Route path="/adoption/form" element={<ApplicationForm />} />

                <Route 
                  path="/board/usage-guide"
                  element={<UsageGuide />}
                />
              </Routes>
            </Box>
          </Grid>
        </Grid>
      </div>
    </>
  );
}

export default function WrappedApp() {
  return (
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>
  );
}
