import { apiSlice } from '~/app/api/apiSlice';

export const statisticsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getStatistics: builder.query({
            query: () => ({
                url: `/Statistics/general`,
                method: 'GET',
            }),
        }),
        getStatisticsUsers: builder.query({
            query: () => ({
                url: `/Statistics/users`,
                method: 'GET',
            }),
        }),
        getStatisticsApprovedContributions: builder.query({
            query: () => ({
                url: `/Statistics/approved-contributions`,
                method: 'GET',
            }),
        }),
        getStatisticsWithFacutly: builder.query({
            query: () => ({
                url: `/Statistics/faculty`,
                method: 'GET',
            }),
        }),
        getPercentageWithAcademicYear: builder.query({
            query: () => ({
                url: `/Statistics/percentage-academic_year`,
                method: 'GET',
            }),
        }),
    }),
});

export const {
    useGetStatisticsQuery,
    useGetStatisticsUsersQuery,
    useGetStatisticsApprovedContributionsQuery,
    useGetStatisticsWithFacutlyQuery,
    useGetPercentageWithAcademicYearQuery,
} = statisticsApiSlice;
