import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
    name: 'User',
    initialState: {
        data: [],
    },
    reducers: {
        setUsers: (state, action) => {
            state.data = action.payload;
        },
        addUser: (state, action) => {
            state.data.push(action.payload);
        },
    },
});

export const { setUsers, addUser } = userSlice.actions;
export default userSlice.reducer;

export const selectCurrentListUsers = (state) => state.user.data;
