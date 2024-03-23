import { apiSlice } from '~/app/api/apiSlice';

export const magazineApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllMagazine: builder.query({
            query: () => ({
                url: `/Magazines`,
                method: 'GET',
            }),
        }),
    }),
});

export const { useGetAllMagazineQuery } = magazineApiSlice;
