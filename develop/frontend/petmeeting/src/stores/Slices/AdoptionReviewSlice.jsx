import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // 필요한 값들 넣기  
};

const adoptionReviewSlice = createSlice({
  name: 'adoptionReview',
  initialState,
  reducers: {
    
    // setshowDevice: (state, action) => {
    //   state.showDevice = action.payload
    // }
  }
});

// export const { 액션 이름 } = adoptionReviewSlice.actions;
export default adoptionReviewSlice.reducer;