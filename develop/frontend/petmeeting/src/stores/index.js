import { configureStore } from '@reduxjs/toolkit';
import messageReducer from './Slices/MessageSlice';
import userReducer from './Slices/UserSlice'

const store = configureStore({
  reducer: {
    message: messageReducer,
    user: userReducer,
    
  }
});

export default store;
