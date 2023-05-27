// This is where we create the API slice. We'll use this to make requests to our API. We'll also use this to store the data we get back from the API.
// Using RTK Query fetchBaseQuery instead of axios to fetch API
// These two imported tools are specifically for 'React'
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials } from "../../features/auth/authSlice";

// Use fetchBaseQuery to create a base query that will be used for all of our requests to the baseUrl
const baseQuery = fetchBaseQuery({
  // TODO: Set this to the deployed API URL
  baseUrl: "http://localhost:5000",
  // 'include' credentials to send cookies with every request
  credentials: "include",
  // Apply the authorization header to every request we send to the API
  prepareHeaders: (headers, { getState }) => {
    // Get the current token that we have
    const token = getState().auth.token;

    // If the token exists, set the authorization header
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

// Query wrapper
const baseQueryWithReauth = async (args, api, extraOptions) => {
  // The original query
  let result = await baseQuery(args, api, extraOptions);

  // Try the original access token. If it doesn't work (we receive a 403 error - FORBIDDEN), then we'll send the refresh token, which will get us a new access token. Then using the new token, we'll try the original query
  if (result?.error?.status === 403) {
    console.log("Sending refresh token!");
    // send refresh token to get new access token
    // args is '/auth/refresh'
    const refreshResult = await baseQuery("/auth/refresh", api, extraOptions);

    if (refreshResult?.data) {
      // store the new token
      api.dispatch(setCredentials({ ...refreshResult.data }));

      // retry original query with new access token
      result = await baseQuery(args, api, extraOptions);
    } else {
      // If we don't have the data (we get a 403 - FORBIDDEN error after using our refresh token as well - getting two 403 errors in a row), we'll set an error message
      if (refreshResult?.error?.status === 403) {
        refreshResult.error.data.message = "Your login session has expired!";
      }
      // If we don't have the data, we'll return the refreshResult, which is the error message
      return refreshResult;
    }
  }

  return result;
};

export const apiSlice = createApi({
  // reducerPath: 'api', // default value even if we don't write it -> it's optional to write
  // Use the baseQuery with the custom wrapper
  baseQuery: baseQueryWithReauth,
  // tagTypes are used to invalidate the cache when we make changes to the data using mutations
  tagTypes: ["Note", "User"],
  // methods to interact with the api
  // specific methods can be found in each apiSlice in the 'features' folder with injectEndpoints
  // Even though it's empty, we still need to have 'endpoints' here as it's required
  endpoints: builder => ({}),
});
