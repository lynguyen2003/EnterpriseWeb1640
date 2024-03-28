import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './api/apiSlice';
import authReducer from '~/feature/auth/authSlice';
import dateReducer from '~/feature/closureDates/dateSlice';
import contributionReducer from '~/feature/contribution/contributionSlice';
import fileReducer from '~/feature/file/fileSlice';

export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        auth: authReducer,
        date: dateReducer,
        contribution: contributionReducer,
        file: fileReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true,
});
