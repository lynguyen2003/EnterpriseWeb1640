import { apiSlice } from '~/app/api/apiSlice';

export const userApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getUserByEmail: builder.query({
            query: (email) => ({
                url: `/Users/${email}`,
                method: 'GET',
            }),
        }),
    }),
});

export const { useGetUserByEmailQuery } = userApiSlice;
