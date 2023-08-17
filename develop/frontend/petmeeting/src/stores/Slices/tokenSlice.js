// Slices/pointSlice.js
import { createSlice } from "@reduxjs/toolkit";

const tokenSlice = createSlice({
  name: "token",
  initialState: 0,
  reducers: {
    setToken: (state, action) => action.payload,
  },
});

export const { setToken } = tokenSlice.actions;
export default tokenSlice.reducer;
