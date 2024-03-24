import { createSlice } from '@reduxjs/toolkit';

const contributionSlice = createSlice({
    name: 'Contribution',
    initialState: {
        isLoading: false,
        data: [],
        error: null,
    },
    reducers: {},
});

export default contributionSlice.reducer;
