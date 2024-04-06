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

        postClosureDates: builder.mutation({
            query: (credentials) => ({
                url: `/ClosureDates`,
                method: 'POST',
                body: { ...credentials },
            }),
        }),
        updateClosureDates: builder.mutation({
            query: (id, credentials) => ({
                url: `/ClosureDates/${id}`,
                method: 'PUT',
                body: { ...credentials },
            }),
        }),
        deleteClosureDates: builder.mutation({
            query: (id) => ({
                url: `/ClosureDates/${id}`,
                method: 'DELETE',
            }),
        }),
    }),
});

export const {
    useGetClosureDateByIdQuery,
    useGetAllClosureDatesQuery,
    usePostClosureDatesMutation,
    useUpdateClosureDatesMutation,
    useDeleteClosureDatesMutation,
} = dateApiSlice;
