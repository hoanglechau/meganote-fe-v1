import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./api/apiSlice";
import { setupListeners } from "@reduxjs/toolkit/query";
import authReducer from "../features/auth/authSlice";

export const store = configureStore({
  // Configure the reducer, making it available to the whole app with the Provider in main.js
  reducer: {
    // The api slice reducer is dynamically named based on 'reducerPath' in 'apiSlice.js' -> default value is 'api'
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
  },
  // Add middleware to the default middleware of Redux
  // apiSlice.middleware is the middleware that apiSlice creates, which manages cache lifetime and expiration. This is required when we're using RTKQuery in apiSlice
  // getDefaultMiddleware returns an array, so we are concatenating the apiSlice.middleware to the array of middlewares
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  // Redux DevTools Extension
  devTools: false,
});

setupListeners(store.dispatch);
