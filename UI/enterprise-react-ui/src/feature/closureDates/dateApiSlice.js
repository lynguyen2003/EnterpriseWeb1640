import { apiSlice } from '~/app/api/apiSlice';

export const dateApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getClosureDateById: builder.query({
            query: (closureDateId) => ({
                url: `/ClosureDates/${closureDateId}`,
                method: 'GET',
            }),
        }),
        getAllClosureDates: builder.query({
            // Add this endpoint
            query: () => ({
                url: '/ClosureDates',
                method: 'GET',
            }),
        }),
    }),
});

export const { useGetClosureDateByIdQuery, useGetAllClosureDatesQuery } = dateApiSlice;
