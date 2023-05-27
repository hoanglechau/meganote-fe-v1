import { apiSlice } from "../../app/api/apiSlice";
import { logOut, setCredentials } from "./authSlice";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    login: builder.mutation({
      // 'credentials' contain the username and password that we send with the query
      query: credentials => ({
        url: "/auth",
        method: "POST",
        body: { ...credentials },
      }),
    }),
    // We don't name this 'logout' because we're importing 'logout' from the auth slice
    sendLogout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      // The 'onQueryStarted' function is provided by RTK Query
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log(data);
          // dispatch the 'logOut' action from the auth slice to set the token to null
          dispatch(logOut());
          setTimeout(() => {
            // dispatch the 'resetApiState' action from the api slice to reset the state of the api slice -> clear out the cache
            dispatch(apiSlice.util.resetApiState());
          }, 1000);
        } catch (err) {
          // Logout errors
          console.log(err);
        }
      },
    }),
    refresh: builder.mutation({
      query: () => ({
        // Sending a GET request to the /auth/refresh endpoint with the cookies in order to get a new access token
        url: "/auth/refresh",
        method: "GET",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log(data);
          // Destructuring the access token from the data received
          const { accessToken } = data;
          dispatch(setCredentials({ accessToken }));
        } catch (err) {
          console.log(err);
        }
      },
    }),
  }),
});

// Export the custom hooks created by RTK Query
export const { useLoginMutation, useSendLogoutMutation, useRefreshMutation } =
  authApiSlice;
