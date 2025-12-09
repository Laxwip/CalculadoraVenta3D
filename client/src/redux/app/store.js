import { configureStore } from '@reduxjs/toolkit';
import exampleReducer from '../features/example/exampleSlice';

export const store = configureStore({
  reducer: {
    example: exampleReducer,
  },
});

export default store;
