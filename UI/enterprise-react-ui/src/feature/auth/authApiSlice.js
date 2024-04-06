import { apiSlice } from '~/app/api/apiSlice';

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials) => ({
                url: '/Auth/Login',
                method: 'POST',
                body: { ...credentials },
            }),
        }),
        forgotPwd: builder.mutation({
            query: (email) => ({
                url: `/Auth/forgot-password/?email=${email}`,
                method: 'POST',
            }),
        }),
        resetPwd: builder.mutation({
            query: (credentials) => ({
                url: '/Auth/reset-password',
                method: 'POST',
                body: { ...credentials },
            }),
        }),
    }),
});

export const { useLoginMutation, useForgotPwdMutation, useResetPwdMutation } = authApiSlice;
