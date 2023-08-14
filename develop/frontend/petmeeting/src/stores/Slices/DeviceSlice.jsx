import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  showDevice: false
};

const deviceSlice = createSlice({
  name: 'device',
  initialState,
  reducers: {
    setshowDevice: (state, action) => {
      state.showDevice = action.payload
    }
  } // 여기서 필요한 액션을 추가할 수 있습니다.
});

export const { setshowDevice} = deviceSlice.actions;
export default deviceSlice.reducer;
