import { createSlice } from '@reduxjs/toolkit';

export const PrinterInitialState = {
    lan: [],
    lanreceipt: [],
    lankitchen: [],
};

export const PrinterSlice = createSlice({
    name: 'printer',
    initialState: PrinterInitialState,
    reducers: {
        setLan: (state, action) => {
            state.lan = action.payload.lan
        },
        setLanKitchen: (state, action) => {
            let data = [];
            if (!data.some(printer => printer?.ip === action.payload.lankitchen?.ip)) {
                data.push(action.payload.lankitchen);
            }
            console.log("kitchen "+  data);
            state.lankitchen = data;
        },
        setLanReceipt: (state, action) => {
            let data = [];
            if (!data.some(printer => printer?.ip === action.payload.lanreceipt?.ip)) {
                data.push(action.payload.lanreceipt);
            }
            console.log("Receipt "+  data);

            state.lanreceipt = data;
            console.log(state.lanreceipt);
        },
    },
});

export const { setLan, setLanKitchen, setLanReceipt } = PrinterSlice.actions;
