import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  selectedCollection: 0,
};

const collectionsSlice = createSlice({
  name: 'collections',
  initialState,
  reducers: {
    setCollections: (state, action) => {
      state.items = action.payload;
    },
    setSelectedCollection: (state, action) => {
      state.selectedCollection = action.payload;
    },
  },
});

export const { setCollections, setSelectedCollection } = collectionsSlice.actions;
export default collectionsSlice.reducer;