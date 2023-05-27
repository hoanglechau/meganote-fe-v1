import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  // We expect to receive the token back from the API
  initialState: { token: null },
  reducers: {
    // Actions
    // Redux uses ImmerJS to allow us to write code that "mutates" the state, but behind the scenes it's actually creating a copy of the state and applying the changes to the copy. This is why we can write code that looks like we're mutating the state, but we're actually not.
    // After we get some data back from the API, we're going to receive an accessToken in the payload
    setCredentials: (state, action) => {
      const { accessToken } = action.payload;
      state.token = accessToken;
    },
    logOut: (state, action) => {
      state.token = null;
    },
  },
});

// Export the actions from the reducer
export const { setCredentials, logOut } = authSlice.actions;

// Export the reducer for the store
export default authSlice.reducer;

// Export a selector
// 'auth' is the name of the slice
export const selectCurrentToken = state => state.auth.token;
