import { createSlice } from '@reduxjs/toolkit';

const fileSlice = createSlice({
    name: 'File',
    initialState: {
        file: null,
    },
    reducers: {
        addFile: (state, action) => {
            const { file } = action.payload;
            state.file = file;
        },
    },
});

export const { addFile } = fileSlice.actions;
export default fileSlice.reducer;
