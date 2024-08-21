import { configureStore } from '@reduxjs/toolkit';
import bookingsReducer from './features/bookings/bookingsSlice';

const store = configureStore({
  reducer: {
    bookings: bookingsReducer,
  },
});

export default store;

