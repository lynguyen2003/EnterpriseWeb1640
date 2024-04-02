import { createSlice } from '@reduxjs/toolkit';

const facultySlice = createSlice({
    name: 'Faculty',
    initialState: {
        faculties: [],
    },
    reducers: {
        setFaculties(state, action) {
            state.faculties = action.payload;
        },
    },
});

export const { setFaculties } = facultySlice.actions;

export default facultySlice.reducer;

export const selectFaculties = (state) => state.faculty.faculties;
