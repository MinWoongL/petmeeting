// src/redux/messageSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  text: "Welcome to the My page!"
};

const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {} // 여기서 필요한 액션을 추가할 수 있습니다.
});

export default messageSlice.reducer;
