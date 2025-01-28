import { configureStore } from '@reduxjs/toolkit';
import collectionsReducer from '../reducers/collectionsSlice';
import requestsReducer from '../reducers/requestsSlice';
import historyReducer from '../reducers/historySlice';

export const store = configureStore({
  reducer: {
    collections: collectionsReducer,
    requests: requestsReducer,
    history: historyReducer
  }
});