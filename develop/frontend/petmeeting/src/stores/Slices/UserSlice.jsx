// stores/slices/UserSlice.jsx

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  avatarUrl:
    "https://www.urbanbrush.net/web/wp-content/uploads/edd/2019/01/urbanbrush-20190108131811238895.png",
  userId: "Duhui",
  password: "",
  points: 0,
  holdingPoint: 1,
  holdingToken: 0,

  isLoggedIn: false,
  isAdopted: false,
  imagePath: null,
};

// id : member
// password : 1234
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      // state.avatarUrl = action.payload.avatarUrl;

      state.userId = action.payload.userId;
      // state.password = action.payload.password;
      state.holdingPoint = action.payload.points;

      state.holdingToken = action.payload.tokens;
      state.imagePath = action.payload.imagePath;
      state.isLoggedIn = true;
      state.isAdopted = action.payload.adopted;
    },
    logout: (state) => {
      // axios 때려서 로그아웃 api 호출하기

      return initialState; // 로그아웃 시 초기 상태로 복귀
    },
    resetToInitialState: (state) => initialState,
    addPoints: (state, action) => {
      state.points += action.payload;
    },
    updateNickName: (state, action) => {
      state.userId = action.payload;
    },
    setPassword: (state, action) => {
      state.password = action.payload;
    },
    updatePointsAndTokens: (state, action) => {
      state.holdingPoint = action.payload.points;
      state.holdingToken = action.payload.tokens;
    },
    // 여기에 추가적인 액션을 정의할 수 있습니다.
  },
});

export const {
  login,
  logout,
  addPoints,
  updateNickName,
  setPassword,
  resetToInitialState,
  updatePointsAndTokens,
} = userSlice.actions;

export default userSlice.reducer;
