// This is where we create the API slice. We'll use this to make requests to our API. We'll also use this to store the data we get back from the API.
// Using RTK Query fetchBaseQuery instead of axios to fetch API
// These two imported tools are specifically for 'React'
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials } from "../../features/auth/authSlice";

// Use fetchBaseQuery to create a base query that will be used for all of our requests to the baseUrl
const baseQuery = fetchBaseQuery({
  baseUrl: "https://technotes-api.onrender.com",
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 403) {
    console.log("sending refresh token");

    // send refresh token to get new access token
    const refreshResult = await baseQuery("/auth/refresh", api, extraOptions);

    if (refreshResult?.data) {
      // store the new token
      api.dispatch(setCredentials({ ...refreshResult.data }));

      // retry original query with new access token
      result = await baseQuery(args, api, extraOptions);
    } else {
      if (refreshResult?.error?.status === 403) {
        refreshResult.error.data.message = "Your login has expired.";
      }
      return refreshResult;
    }
  }

  return result;
};

export const apiSlice = createApi({
  // reducerPath: 'api', // default value even if we don't write it -> it's optional to write
  baseQuery: baseQueryWithReauth,
  // tagTypes are used to invalidate the cache when we make changes to the data using mutations
  tagTypes: ["Note", "User"],
  // methods to interact with the api
  // specific methods can be found in each apiSlice in the 'features' folder with injectEndpoints
  // Even though it's empty, we still need to have 'endpoints' here as it's required
  endpoints: builder => ({}),
});
