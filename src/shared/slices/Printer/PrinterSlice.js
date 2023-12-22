import { createSlice } from '@reduxjs/toolkit';

export const PrinterInitialState = {
    config: null
};

export const PrinterSlice = createSlice({
    name: 'printer',
    initialState: PrinterInitialState,
    reducers: {
        setConfig: (state, action) => {
            state.config = action.payload.config
        },
    },
});

export const { setConfig } = PrinterSlice.actions;
