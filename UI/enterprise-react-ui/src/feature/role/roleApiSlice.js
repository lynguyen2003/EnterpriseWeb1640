import { apiSlice } from '~/app/api/apiSlice';

export const roleApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getUserRole: builder.mutation({
            query: (email) => ({
                url: `/SetupRole/GetUserRoles?email=${email}`,
                method: 'GET',
            }),
        }),
    }),
});

export const { useGetUserRoleMutation } = roleApiSlice;
