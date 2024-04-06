import { apiSlice } from '~/app/api/apiSlice';

export const facultyApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getFacultyById: builder.mutation({
            query: (id) => ({
                url: `/Faculties/${id}`,
                method: 'GET',
            }),
        }),
        GetAllFaculties: builder.query({
            query: () => ({
                url: '/Faculties/',
                method: 'GET',
            }),
        }),
    }),
});

export const { useGetFacultyByIdMutation, useGetAllFacultiesQuery } = facultyApiSlice;
