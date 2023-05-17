import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./api/apiSlice";

export const store = configureStore({
  // configure the reducer
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  // add middleware to the default middleware
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});
