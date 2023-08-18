// src/redux/messageSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  text: "Welcome to the Main page!"
};

const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    setMessage: (state, action) => {
      state.text = action.payload
    }
  } // 여기서 필요한 액션을 추가할 수 있습니다.
});

export const { setMessage } = messageSlice.actions
export default messageSlice.reducer;
