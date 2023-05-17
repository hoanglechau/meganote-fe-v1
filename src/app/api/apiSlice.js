// Using RTK Query fetchBaseQuery instead of axios to fetch API
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000" }),
  tagTypes: ["Note, User"],
  endpoints: builder => ({}),
});
