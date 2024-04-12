import { apiSlice } from '~/app/api/apiSlice';

export const emailApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        sendEmailRequest: builder.mutation({
            query: (facultiesId) => ({
                url: `/Emails/SendEmail?facultiesId=${facultiesId}`,
                method: 'GET',
            }),
        }),
    }),
});

export const { useSendEmailRequestMutation } = emailApiSlice;
