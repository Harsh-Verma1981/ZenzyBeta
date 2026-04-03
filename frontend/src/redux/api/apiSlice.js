import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../constants";
import { logout } from "../features/auth/authSlice";

const baseQueryWithAuth = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: "include",
});

const baseQuery = async (args, api, extraOptions) => {
  let result = await baseQueryWithAuth(args, api, extraOptions);

  // If we get a 401, logout the user
  if (result.error?.status === 401) {
    console.log("Got 401, logging out");
    api.dispatch(logout());
    window.location.href = "/login";
  }

  return result;
};

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ["Product", "Order", "User", "Category"],
  endpoints: () => ({}),
});
