import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: {},
};

const requestsSlice = createSlice({
  name: 'requests',
  initialState,
  reducers: {
    setRequests: (state, action) => {
      state.items = action.payload;
    },
  },
});

export const { setRequests } = requestsSlice.actions;
export default requestsSlice.reducer;