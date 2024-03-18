import { apiSlice } from "../../app/api/apiSlice";

export const contributionsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getContributions: builder.query({
            query: () => '/Contributions', // Assuming this is the correct endpoint for contributions
            keepUnusedDataFor: 5,
        })
    })
});

export const {
    useGetContributionsQuery
} = contributionsApiSlice;
