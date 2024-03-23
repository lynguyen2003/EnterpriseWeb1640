import { createSlice } from '@reduxjs/toolkit';

const dateSlice = createSlice({
    name: 'date',
    initialState: {
        data: [], // Initial state for your data
    },
    reducers: {
        setData: (state, action) => {
            state.data = action.payload; // Update the data state with payload
        },
    },
});

export const { setData } = dateSlice.actions; // Extracting the action creator
export default dateSlice.reducer; // Exporting the reducer
