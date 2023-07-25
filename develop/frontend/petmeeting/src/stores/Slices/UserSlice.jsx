// stores/slices/UserSlice.jsx

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  avatarUrl: 'https://www.urbanbrush.net/web/wp-content/uploads/edd/2019/01/urbanbrush-20190108131811238895.png',
  nickname: 'Duhee',
  password: '',
  points: 0,
  isLoggedIn: false
};

// id : member
// password : 1234
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action) => {
      // state.avatarUrl = action.payload.avatarUrl;
      state.nickname = action.payload.nickname;
      state.password = action.payload.password;
      // state.points = action.payload.points;
      state.isLoggedIn = true;
    },
    logout: (state) => {
      return initialState; // 로그아웃 시 초기 상태로 복귀
    },
    addPoints: (state, action) => {
      state.points += action.payload;
    },
    updateNickName: (state, action) => {
      state.nickname = action.payload;
    },
    setPassword: (state, action) => {
      state.password = action.payload;
    }
    // 여기에 추가적인 액션을 정의할 수 있습니다.
  }
});

export const { login, logout, addPoints, updateNickName, setPassword } = userSlice.actions;

export default userSlice.reducer;
