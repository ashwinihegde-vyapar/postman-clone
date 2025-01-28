import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: []
};

const responseSlice = createSlice({
  name: 'response',
  initialState,
  reducers: {
    setResponse: (state, action) => {
      state.items = action.payload;
    }
  }
});

export const { setResponse } = responseSlice.actions;
export default responseSlice.reducer;
