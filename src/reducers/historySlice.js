import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: {}
};

const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    setHistory: (state, action) => {
      state.items = action.payload;
    },
    addToHistory: (state, action) => {
      const { date, request } = action.payload;
      if (!state.items[date]) {
        state.items[date] = [];
      }
      // Remove any existing request with same URL
      state.items[date] = state.items[date].filter(req => req.url !== request.url);
      // Add the new request
      state.items[date].push(request);
    },
    clearHistory: (state) => {
      state.items = {};
    }
  }
});

export const { setHistory, addToHistory, clearHistory } = historySlice.actions;
export default historySlice.reducer; 