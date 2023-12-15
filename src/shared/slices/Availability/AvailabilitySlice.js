import { createSlice } from '@reduxjs/toolkit';

export const AvailabilityInitialState = {
    categories: []
};

export const availabilitySlice = createSlice({
    name: 'availability',
    initialState: AvailabilityInitialState,
    reducers: {
        setCategories: (state, action) => {
            state.categories = action.payload.categories
        }
    },
});

export const { setCategories } = availabilitySlice.actions;
