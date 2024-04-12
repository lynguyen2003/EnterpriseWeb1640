import { apiSlice } from '~/app/api/apiSlice';

export const roleApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllRoles: builder.query({
            query: () => ({
                url: `/SetupRole`,
                method: 'GET',
            }),
        }),

        getUserRole: builder.mutation({
            query: (email) => ({
                url: `/SetupRole/GetUserRoles?email=${email}`,
                method: 'GET',
            }),
        }),
        addUserToRole: builder.mutation({
            query: (data) => ({
                url: '/SetupRole/AddUserToRole',
                method: 'POST',
                body: {
                    email: data.email,
                    oldRoleName: data.oldRoleName,
                    roleName: data.roleName,
                },
            }),
        }),
    }),
});

export const { useGetAllRolesQuery, useGetUserRoleMutation, useAddUserToRoleMutation } = roleApiSlice;
