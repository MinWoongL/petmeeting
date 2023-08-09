import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    inquiry: []
};

const inquirySlice = createSlice({
    name: "inquiry",
    initialState,
    reducers: {
        setInquiry: (state, action) => {
            state.inquiry = action.payload
        }
    }
});

export const { setInquiry } = inquirySlice.actions;
export default inquirySlice.reducer;