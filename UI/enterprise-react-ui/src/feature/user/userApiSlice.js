import { apiSlice } from '~/app/api/apiSlice';

export const userApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllUser: builder.query({
            query: () => ({
                url: `/Users`,
                method: 'GET',
            }),
        }),
        getUserByEmail: builder.query({
            query: (email) => ({
                url: `/Users/${email}`,
                method: 'GET',
            }),
        }),
        getUserByUserId: builder.mutation({
            query: (userId) => ({
                url: `/Users/UserId?userId=${userId}`,
                method: 'GET',
            }),
        }),
        postUser: builder.mutation({
            query: (credentials) => ({
                url: '/Users',
                method: 'POST',
                body: credentials,
            }),
        }),
        updateUser: builder.mutation({
            query: (user) => ({
                url: `/Users`,
                method: 'PUT',
                body: user,
            }),
        }),
        deleteUser: builder.mutation({
            query: (userId) => ({
                url: `/Users/${userId}`,
                method: 'DELETE',
            }),
        }),
    }),
});

export const {
    useGetAllUserQuery,
    useGetUserByEmailQuery,
    useGetUserByUserIdMutation,
    usePostUserMutation,
    useUpdateUserMutation,
    useDeleteUserMutation,
} = userApiSlice;
