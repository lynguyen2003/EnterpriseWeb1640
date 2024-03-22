import { createSlice } from '@reduxjs/toolkit';

const roleSlice = createSlice({
    name: 'Role',
    initialState: {
        roles: [],
        loading: false,
        error: null,
    },
    reducers: {
        setRoles: (state, action) => {
            state.roles = action.payload;
            state.loading = false;
            state.error = null;
        },
        setLoading: (state) => {
            state.loading = true;
            state.error = null;
        },
        setError: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const { setRoles, setLoading, setError } = roleSlice.actions;
export default roleSlice.reducer;

export const selectCurrentUserRole = (state) => state.role.roles;
