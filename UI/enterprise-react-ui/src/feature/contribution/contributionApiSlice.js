import { apiSlice } from '~/app/api/apiSlice';

export const contributionApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllContribution: builder.query({
            query: () => ({
                url: `/Contributions`,
                method: 'GET',
            }),
        }),
        post: builder.mutation({
            query: (credentials) => ({
                url: '/Contributions',
                method: 'POST',
                body: { ...credentials },
            }),
        }),
    }),
});

export const { useGetAllContributionQuery, usePostMutation } =
    contributionApiSlice;
