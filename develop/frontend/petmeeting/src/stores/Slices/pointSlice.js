// Slices/pointSlice.js
import { createSlice } from "@reduxjs/toolkit";

const pointSlice = createSlice({
  name: "point",
  initialState: 0,
  reducers: {
    setPoint: (state, action) => action.payload,
  },
});

export const { setPoint } = pointSlice.actions;
export default pointSlice.reducer;
