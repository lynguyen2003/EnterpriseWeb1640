import { createSlice } from '@reduxjs/toolkit';

const roleSlice = createSlice({
    name: 'Role',
    initialState: {
        roleName: null,
    },
    reducers: {
        setRoleNames: (state, action) => {
            state.roleName.push(action.payload);
        },
    },
});

export const { setRoleNames } = roleSlice.actions;
export default roleSlice.reducer;

export const selectRoleName = (state) => state.role.roleName;
