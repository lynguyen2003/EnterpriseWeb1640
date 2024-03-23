import { apiSlice } from '~/app/api/apiSlice';

export const dateApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getClosureDateById: builder.query({
            query: (closureDateId) => ({
                url: `/ClosureDates/${closureDateId}`,
                method: 'GET',
            }),
        }),
    }),
});

export const { useGetClosureDateByIdQuery } = dateApiSlice;
