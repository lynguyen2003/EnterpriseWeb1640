import { apiSlice } from '~/app/api/apiSlice';

export const contributionApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllContribution: builder.query({
            query: () => ({
                url: `/Contributions`,
                method: 'GET',
            }),
        }),
        getContributionByUserId: builder.query({
            query: (userId) => ({
                url: `/Contributions/user/${userId}`,
                method: 'GET',
            }),
        }),
        postContribution: builder.mutation({
            query: (credentials) => ({
                url: '/Contributions',
                method: 'POST',
                body: { ...credentials },
            }),
        }),
        putContribution: builder.mutation({
            query: (credentials) => ({
                url: '/Contributions',
                method: 'PUT',
                body: { ...credentials },
            }),
        }),
        deleteContribution: builder.mutation({
            query: (id) => ({
                url: `/Contributions/${id}`,
                method: 'DELETE',
            }),
        }),
    }),
});

export const {
    useGetAllContributionQuery,
    useGetContributionByUserIdQuery,
    usePutContributionMutation,
    usePostContributionMutation,
    useDeleteContributionMutation,
} = contributionApiSlice;
