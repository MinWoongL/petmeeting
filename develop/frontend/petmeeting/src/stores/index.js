import { configureStore } from "@reduxjs/toolkit";
import messageReducer from "./Slices/MessageSlice";
import userReducer from "./Slices/UserSlice";
import dogReducer from "./Slices/DogSlice";
import reviewReducer from "./Slices/ReviewSlice";
import DeviceSlice from "./Slices/DeviceSlice";
import AdoptionReviewSlice from "./Slices/AdoptionReviewSlice";
import sessionSlice from "./Slices/sessionSlice";
import InquirySlice from "./Slices/InquirySlice";
import pointReducer from "./Slices/pointSlice";
const store = configureStore({
  reducer: {
    message: messageReducer,
    user: userReducer,
    dogs: dogReducer,
    reviews: reviewReducer,
    device: DeviceSlice,
    adoptionReview: AdoptionReviewSlice,
    session: sessionSlice,
    inquiry: InquirySlice,
    point: pointReducer,
  },
});

export default store;
