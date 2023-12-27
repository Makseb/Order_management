import { createSlice } from '@reduxjs/toolkit';

export const PrinterInitialState = {
    // lan
    lan: [],
    lanreceipt: [],
    lankitchen: [],
    // bluetooth
    bluetooth: [],
    bluetoothreceipt: [],
    bluetoothkitchen: []
};

export const PrinterSlice = createSlice({
    name: 'printer',
    initialState: PrinterInitialState,
    reducers: {
        // lan
        setLan: (state, action) => {
            state.lan = action.payload.lan
        },
        setLanKitchen: (state, action) => {
            let data = state.lankitchen ? state.lankitchen : []
            const isDuplicate = data.some(item => item.ip === action.payload.lankitchen.ip);
            if (!isDuplicate) {
                data.push(action.payload.lankitchen);
            }
            state.lankitchen = data;
        },
        removeLanKitchen: (state, action) => {
            state.lankitchen = state.lankitchen.filter(lankitchen => lankitchen.ip !== action.payload.ip);
        },
        setLanReceipt: (state, action) => {
            let data = state.lanreceipt ? state.lanreceipt : [];
            const isDuplicate = data.some(item => item.ip === action.payload.lanreceipt.ip);
            if (!isDuplicate) {
                data.push(action.payload.lanreceipt);
            }
            state.lanreceipt = data;
        },
        removeLanReceipt: (state, action) => {
            state.lanreceipt = state.lanreceipt.filter(lanreceipt => lanreceipt.ip !== action.payload.ip);
        },

        // bluetooth
        setBluetooth: (state, action) => {
            let data = state.bluetooth ? state.bluetooth : [];
            const isDuplicate = data.some(item => item.name === action.payload.name);
            if (!isDuplicate) {
                data.push({ name: action.payload.name });
            }
            state.bluetooth = data;
        },
        setBluetoothKitchen: (state, action) => {
            let data = state.bluetoothkitchen ? state.bluetoothkitchen : []
            const isDuplicate = data.some(item => item.name === action.payload.bluetoothkitchen.name);
            if (!isDuplicate) {
                data.push(action.payload.bluetoothkitchen);
            }
            state.bluetoothkitchen = data;
        },
        removeBluetoothKitchen: (state, action) => {
            state.bluetoothkitchen = state.bluetoothkitchen.filter(bluetoothkitchen => bluetoothkitchen.name !== action.payload.name);
        },
        setBluetoothReceipt: (state, action) => {
            let data = state.bluetoothreceipt ? state.bluetoothreceipt : [];
            const isDuplicate = data.some(item => item.name === action.payload.bluetoothreceipt.name);
            if (!isDuplicate) {
                data.push(action.payload.bluetoothreceipt);
            }
            state.bluetoothreceipt = data;
        },
        removeBluetoothReceipt: (state, action) => {
            state.bluetoothreceipt = state.bluetoothreceipt.filter(bluetoothreceipt => bluetoothreceipt.name !== action.payload.name);
        },


    },
});

export const { setLan, setLanKitchen, setLanReceipt, removeLanKitchen, removeLanReceipt, setBluetooth, setBluetoothKitchen, removeBluetoothKitchen, setBluetoothReceipt, removeBluetoothReceipt } = PrinterSlice.actions;
