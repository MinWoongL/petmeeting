import { configureStore } from '@reduxjs/toolkit';
import messageReducer from './Slices/MessageSlice';
import userReducer from './Slices/UserSlice';
import dogReducer from './Slices/DogSlice'
import reviewReducer from './Slices/ReviewSlice'
import DeviceSlice from './Slices/DeviceSlice';
import AdoptionReviewSlice from './Slices/AdoptionReviewSlice';
import sessionSlice from './Slices/sessionSlice';

const store = configureStore({
  reducer: {
    message: messageReducer,
    user: userReducer,
    dogs: dogReducer,
    reviews: reviewReducer,
    device: DeviceSlice,
    adoptionReview: AdoptionReviewSlice,
    session: sessionSlice
  }
});

export default store;
