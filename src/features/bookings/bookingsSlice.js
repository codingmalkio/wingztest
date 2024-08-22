import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const SERVER_URL = 'http://localhost:3000';
const OPENROUTE_URL = 'https://api.openrouteservice.org';
import Constants from 'expo-constants';

// Async thunk for fetching bookings
export const fetchBookings = createAsyncThunk(
  'bookings/fetchBookings',
  async () => {
    const response = await fetch(SERVER_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch bookings');
    }
    return response.json();
  }
);

export const addBooking = createAsyncThunk(
  'bookings/addBooking',
  async (bookingData) => {
    const response = await fetch(SERVER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    });
    if (!response.ok) {
      throw new Error('Failed to add booking');
    }
    return response.json();
  }
);

export const updateBookingStatus = createAsyncThunk(
  'bookings/updateBookingStatus',
  async (bookingData) => {
    const { bookingId, status } = bookingData;
    const response = await fetch(`${SERVER_URL}/${bookingId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) {
      throw new Error('Failed to update booking status');
    }
    return response.json();
  }
);

export const calculateRoute = createAsyncThunk(
  'bookings/calculateRoute',
  async (routeData) => {
    const { start, end } = routeData;
    const OPENROUTE_APIKEY = Constants.expoConfig.extra.OPENROUTE_APIKEY;
    if (OPENROUTE_APIKEY === undefined) {
      throw new Error('Please provide API_ROUTE_KEY in app.json');
    }

    const response = await fetch(OPENROUTE_URL + `/v2/directions/driving-car?api_key=${OPENROUTE_APIKEY}&start=${start.longitude},${start.latitude}&end=${end.longitude},${end.latitude}`);
    if (!response.ok) {
      throw new Error('Failed to calculate route');
    }
    return response.json();
  }
);

// export const getAddress = createAsyncThunk(
//   'bookings/getAddress',
//   async (coordinate) => {
//     const response = await fetch(`https://api.openrouteservice.org/geocode/reverse?api_key=${OPENROUTE_APIKEY}&point.lon=${coordinate.longitude}&point.lat=${coordinate.latitude}.circle.radius=0.1&size=1`);
//     if (!response.ok) {
//       throw new Error('Failed to get address');
//     }
//     return response.json();
//   }
// );

const bookingsSlice = createSlice({
  name: 'bookings',
  initialState: {
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    bookings: [],
    error: null,
    previewRoute: []
  },
  reducers: {
    setPreviewRoute: (state, action) => {
      state.previewRoute = action.payload;
    },
    clearPreviewRoute: (state) => {
      state.previewRoute = [];
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchBookings.pending, (state, action) => {
      state.status = 'loading';
    }).addCase(fetchBookings.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.bookings = [].concat(action.payload);
    }).addCase(updateBookingStatus.fulfilled, (state, action) => {
      const { id, status } = action.payload;
      let bookings = [...state.bookings];
      const indexOfBooking = bookings.findIndex(booking => booking.id === id);
      if (indexOfBooking !== -1) {
        bookings[indexOfBooking].status = status;
        state.bookings = bookings;
      }
    }).addCase(fetchBookings.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.error.message;
    }).addCase(addBooking.fulfilled, (state, action) => {
      state.bookings.push(action.payload);
    }).addCase(calculateRoute.fulfilled, (state, action) => {
      let previewRoute = [];
      action.payload.features[0].geometry.coordinates.forEach((coordinate) => {
        previewRoute.push({
          latitude: coordinate[1],
          longitude: coordinate[0]
        });
      });
      state.previewRoute = previewRoute;
    })
  }
});

export const { requestBooking, clearPreviewRoute } = bookingsSlice.actions;
export default bookingsSlice.reducer;

