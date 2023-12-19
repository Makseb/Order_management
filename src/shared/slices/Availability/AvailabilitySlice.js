import { createSlice } from '@reduxjs/toolkit';

export const AvailabilityInitialState = {
    categories: [],
    products: []
};

export const availabilitySlice = createSlice({
    name: 'availability',
    initialState: AvailabilityInitialState,
    reducers: {
        setCategories: (state, action) => {
            state.categories = action.payload.categories
        },
        setProducts: (state, action) => {
            state.products = action.payload.products
        }
    },
});

export const { setCategories,setProducts } = availabilitySlice.actions;
