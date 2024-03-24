import { apiSlice } from '~/app/api/apiSlice';

export const contributionApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllContribution: builder.query({
            query: () => ({
                url: `/Contributions`,
                method: 'GET',
            }),
        }),
    }),
});

export const { useGetAllContributionQuery } = contributionApiSlice;
