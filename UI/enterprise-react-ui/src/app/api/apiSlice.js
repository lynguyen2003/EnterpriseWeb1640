import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setCredentials, logOut } from '~/feature/auth/authSlice';

const baseQuery = fetchBaseQuery({
    baseUrl: 'https://20.189.75.22/api',
    prepareHeaders: (headers) => {
        const token = localStorage.getItem('token');
        if (token) {
            headers.set('authorization', `Bearer ${token}`);
        }
        return headers;
    },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions).catch((error) => {
        console.error('Error occurred during base query: ', error);
        return { error };
    });

    if (result?.error?.status === 401) {
        const token = localStorage.getItem('token');
        const refreshToken = localStorage.getItem('refreshToken');
        const email = localStorage.getItem('email');

        if (!token) {
            api.dispatch(logOut());
            return result;
        }

        const refreshResult = await baseQuery(
            {
                url: '/Auth/RefreshToken',
                method: 'POST',
                body: { token, refreshToken },
            },
            api,
            extraOptions,
        ).catch((error) => {
            console.error('Error occurred during token refresh: ', error);
            return { error };
        });

        if (refreshResult) {
            const { token, refreshToken } = refreshResult;
            api.dispatch(setCredentials({ token, refreshToken, email }));
            result = await baseQuery(args, api, extraOptions).catch((error) => {
                console.error('Error occurred during retrying base query: ', error);
                return { error };
            });
        } else {
            api.dispatch(logOut());
        }
    }

    return result;
};

export const apiSlice = createApi({
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({}),
});
