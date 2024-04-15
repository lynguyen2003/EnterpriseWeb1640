import { apiSlice } from '~/app/api/apiSlice';

export const statisticsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getStatistics: builder.query({
            query: () => ({
                url: `/Statistics/contributions-count`,
                method: 'GET',
            }),
        }),
    }),
});

export const { useGetStatisticsQuery } = statisticsApiSlice;
