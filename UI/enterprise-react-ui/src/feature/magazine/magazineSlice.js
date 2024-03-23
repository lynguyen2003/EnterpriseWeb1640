import { createSlice } from '@reduxjs/toolkit';

const magazine = createSlice({
    name: 'Magazine',
    initialState: {
        data: [],
    },
});

export default magazine.reducer;
