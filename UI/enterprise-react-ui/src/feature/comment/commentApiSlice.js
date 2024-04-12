import { apiSlice } from '~/app/api/apiSlice';

export const commentApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        addComment: builder.mutation({
            query: (comment) => ({
                url: '/Comments',
                method: 'POST',
                body: { ...comment },
            }),
        }),
        getCommentsByContributionId: builder.mutation({
            query: (id) => ({
                url: `/Comments/Contribution?contributionId=${id}`,
                method: 'GET',
            }),
        }),
    }),
});

export const { useAddCommentMutation, useGetCommentsByContributionIdMutation } = commentApiSlice;
