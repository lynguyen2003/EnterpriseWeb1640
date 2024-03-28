import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './api/apiSlice';
import authReducer from '~/feature/auth/authSlice';
import dateReducer from '~/feature/closureDates/dateSlice';
import contributionReducer from '~/feature/contribution/contributionSlice';

export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        auth: authReducer,
        date: dateReducer,
        contribution: contributionReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true,
});
