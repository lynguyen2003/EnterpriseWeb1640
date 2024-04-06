import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './api/apiSlice';
import authReducer from '~/feature/auth/authSlice';
import dateReducer from '~/feature/closureDates/dateSlice';
import contributionReducer from '~/feature/contribution/contributionSlice';
import fileReducer from '~/feature/file/fileSlice';
import userReducer from '~/feature/user/userSlice';
import roleReducer from '~/feature/role/roleSlice';
import facultyReducer from '~/feature/faculty/facultySlice';

export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        auth: authReducer,
        date: dateReducer,
        contribution: contributionReducer,
        file: fileReducer,
        user: userReducer,
        role: roleReducer,
        faculty: facultyReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true,
});
