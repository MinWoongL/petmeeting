import { configureStore } from '@reduxjs/toolkit';
import messageReducer from './Slices/MessageSlice';
import messageReducer2 from './Slices/MessageSlice2';

const store = configureStore({
  reducer: {
    message: messageReducer,
    message2: messageReducer2
  }
});

export default store;
