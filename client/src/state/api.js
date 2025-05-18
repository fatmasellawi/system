import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5000' }), // ajuste selon ton backend
  endpoints: (builder) => ({
    getUser: builder.query({
      query: (id) => `/general/user/${id}`,
    }),
  }),
});

export const { useGetUserQuery } = api;
