import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sessionInstance: "",
  subscribers: ""
};

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setSessionInstance: (state, action) => {
      state.sessionInstance = action.payload
    },
    setSubscribers: (state, action) => {
      state.subscribers = action.payload
    }
  } // 여기서 필요한 액션을 추가할 수 있습니다.
});

export const { setSessionInstance, setSubscribers } = sessionSlice.actions
export default sessionSlice.reducer;
