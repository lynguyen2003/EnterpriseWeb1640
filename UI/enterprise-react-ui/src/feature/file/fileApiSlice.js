import { apiSlice } from '~/app/api/apiSlice';

export const fileApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getFile: builder.query({
            query: (fileName) => ({
                url: `/Files/downloadfile?FileName=${fileName}`,
                method: 'GET',
            }),
        }),
        postFile: builder.mutation({
            query: (file) => {
                const formData = new FormData();
                formData.append('_IFormFile', file);
                return {
                    url: '/Files/uploadfile',
                    method: 'POST',
                    body: formData,
                };
            },
        }),
    }),
});

export const { usePostFileMutation, useGetFileQuery } = fileApiSlice;
