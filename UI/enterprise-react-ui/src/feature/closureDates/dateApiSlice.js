import { apiSlice } from '~/app/api/apiSlice';

export const dateApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getClosureDateById: builder.mutation({
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
            query: (data) => ({
                url: `/ClosureDates/${data.id}`,
                method: 'PUT',
                body: {
                    academicYear: data.academicYear,
                    closureDate: data.closureDate,
                    finalClosureDate: data.finalClosureDate,
                    isSet: data.isSet,
                },
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
    useGetClosureDateByIdMutation,
    useGetAllClosureDatesQuery,
    usePostClosureDatesMutation,
    useUpdateClosureDatesMutation,
    useDeleteClosureDatesMutation,
} = dateApiSlice;
