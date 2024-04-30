import { apiSlice } from '~/app/api/apiSlice';

export const createParams = (data) => {
    const params = new URLSearchParams();
    Object.keys(data).forEach((key) => {
        if (data[key] !== undefined && data[key] !== null) {
            params.append(key, data[key]);
        }
    });
    return params;
};

export const contributionApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllContribution: builder.query({
            query: () => ({
                url: `/Contributions`,
                method: 'GET',
            }),
        }),
        getContributionWithParams: builder.mutation({
            query: (data) => {
                const params = createParams({
                    PageNum: data.pageNum,
                    PageSize: data.pageSize,
                    isPublished: data.isPublished,
                    isApproved: data.isApproved,
                    facultyName: data.facultyName,
                });

                return {
                    url: `/Contributions?${params.toString()}`,
                    method: 'GET',
                };
            },
        }),
        getContributionApproved: builder.query({
            query: (isApproved) => ({
                url: `/Contributions?IsApproved=${isApproved}`,
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
    useGetContributionWithParamsMutation,
    useGetContributionApprovedQuery,
    useGetContributionByUserIdQuery,
    usePutContributionMutation,
    usePostContributionMutation,
    useDeleteContributionMutation,
} = contributionApiSlice;
