import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './stores/index';
import { AppBar, Button, Toolbar, Typography, Grid, Box } from '@mui/material'
import MainPage from './pages/MainPage';
import ShelterPage from './pages/Shelter';
import AdoptionPage from './pages/Adoption';
import BoardPage from './pages/Board';
import MyPage from './pages/MyPage';
import InfoSidebar from './components/Sidebar/InfoSidebar'
import RankSystemSidebar from './components/Sidebar/RankSystemSidebar'
import './styles/base.css'


function NavBar() {
  return (
    <AppBar position="static" className='theme-blueberry' style={{ backgroundColor : 'var(--dark)'}}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          HappyDog! Test
        </Typography>
        <Button color="inherit" component={Link} to="/">Home</Button>
        <Button color="inherit" component={Link} to="/shelter">보호소</Button>
        <Button color="inherit" component={Link} to="/adoption">입양하기</Button>
        <Button color="inherit" component={Link} to="/board">게시판</Button>
        <Button color="inherit" component={Link} to="/mypage">마이페이지</Button>
      </Toolbar>
    </AppBar>
  );
}


function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="theme-yellow" style={{ height: '100vh', backgroundColor: 'var(--yellow2)' }}>
          <NavBar />

          <Grid container spacing={3} style={{ height: 'calc(100% - 64px)' }}>
            <Grid item xs={3}> {/* 왼쪽 3칸 */}
              <Box border={1} borderColor="grey.900" height="100%">
                <Grid container direction="column" style={{ height: '100%' }}>
                  <Grid item style={{ flex: 2 }}>
                    <Box border={1} borderColor="grey.900" height="100%">
                      <InfoSidebar />
                    </Box>
                  </Grid>
                  <Grid item style={{ flex: 3 }}>
                    <Box border={1} borderColor="grey.900" height="100%">
                      <RankSystemSidebar />
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Grid>

            <Grid item xs={9}> {/* 오른쪽 9칸 */}
              <Box border={1} borderColor="grey.900" height="100%">
                <Routes>
                  <Route path="/" exact element={<MainPage />} />
                  <Route path="/shelter" element={<ShelterPage />} />
                  <Route path="/adoption" element={<AdoptionPage />} />
                  <Route path="/board" element={<BoardPage />} />
                  <Route path="/mypage" element={<MyPage />} />
                </Routes>
              </Box>
            </Grid>
          </Grid>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
