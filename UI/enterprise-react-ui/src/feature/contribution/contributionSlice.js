import { createSlice } from '@reduxjs/toolkit';

const contributionSlice = createSlice({
    name: 'Contribution',
    initialState: {
        data: [],
    },
    reducers: {
        addContribution: (state, action) => {
            state.data.push(action.payload);
        },
    },
});

export const { addContribution } = contributionSlice.actions;
export default contributionSlice.reducer;
