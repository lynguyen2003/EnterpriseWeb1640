import { apiSlice } from '~/app/api/apiSlice';
import { createParams } from '~/feature/contribution/contributionApiSlice';

export const userApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllUser: builder.query({
            query: () => ({
                url: `/Users`,
                method: 'GET',
            }),
        }),
        getUsersWithParams: builder.query({
            query: (data) => {
                const params = createParams({
                    PageNum: data.pageNum,
                    PageSize: data.pageSize,
                    Email: data.email,
                    FacultiesId: data.facultiesId,
                });

                return {
                    url: `/Users?${params.toString()}`,
                    method: 'GET',
                };
            },
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
    useGetUsersWithParamsQuery,
    useGetUserByEmailQuery,
    useGetUserByUserIdMutation,
    usePostUserMutation,
    useUpdateUserMutation,
    useDeleteUserMutation,
} = userApiSlice;
