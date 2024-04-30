import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'Auth',
    initialState: {
        email: localStorage.getItem('email') || null,
        token: localStorage.getItem('token') || null,
        refreshToken: localStorage.getItem('refreshToken') || null,
    },
    reducers: {
        setCredentials: (state, action) => {
            const { email, token, refreshToken } = action.payload;
            state.email = email;
            state.token = token;
            state.refreshToken = refreshToken;
            localStorage.setItem('email', email); // Save token to localStorage
            localStorage.setItem('token', token); // Save token to localStorage
            localStorage.setItem('refreshToken', refreshToken); // Save token to localStorage
        },
        logOut: (state, action) => {
            state.email = null;
            state.token = null;
            state.refreshToken = null;
            localStorage.removeItem('email'); // Remove token from localStorage
            localStorage.removeItem('token'); // Remove token from localStorage
            localStorage.removeItem('refreshToken'); // Remove token from localStorage
        },
    },
});

export const { setCredentials, logOut } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentEmail = (state) => state.auth.email;
export const selectCurrentToken = (state) => state.auth.token;
export const selectIsAuthenticated = (state) => !!state.auth.token;
