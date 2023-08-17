import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sessionInstance: null,
  subscribers: [],
  publisher: null  // 여기에 publisher를 추가합니다.
};

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setSessionInstance: (state, action) => {
      state.sessionInstance = action.payload;
    },
    setSubscribers: (state, action) => {
      state.subscribers = action.payload;
    },
    setPublisher: (state, action) => {  // 새로운 액션 추가
      state.publisher = action.payload;
    }
  }
});

export const { setSessionInstance, setSubscribers, setPublisher } = sessionSlice.actions;
export default sessionSlice.reducer;
