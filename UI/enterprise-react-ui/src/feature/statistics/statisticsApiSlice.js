import { apiSlice } from '~/app/api/apiSlice';

export const statisticsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getStatistics: builder.query({
            query: () => ({
                url: `/Statistics/general`,
                method: 'GET',
            }),
        }),
        getStatisticsWithFacutly: builder.query({
            query: () => ({
                url: `/Statistics/faculty`,
                method: 'GET',
            }),
        }),
        getPercentage: builder.query({
            query: () => ({
                url: `/Statistics/percentage`,
                method: 'GET',
            }),
        }),
    }),
});

export const { useGetStatisticsQuery, useGetStatisticsWithFacutlyQuery, useGetPercentageQuery } = statisticsApiSlice;
