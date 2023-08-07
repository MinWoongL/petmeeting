import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  adoptionReview: []
};

const adoptionReviewSlice = createSlice({
  name: "adoptionReview",
  initialState,
  reducers: {
    setAdoptionReview: (state, action) => {
      state.adoptionReview = action.payload
    }
  }
});

export const { setAdoptionReview } = adoptionReviewSlice.actions;
export default adoptionReviewSlice.reducer;