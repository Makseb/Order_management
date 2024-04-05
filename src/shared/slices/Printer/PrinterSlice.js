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

export const printerSlice = createSlice({
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

        // set bluetooth by id device
        setBluetooth: (state, action) => {
            // let data = state.bluetooth ? state.bluetooth : [];
            // const isDuplicate = data.some(item => item.id === action.payload.id);
            // if (!isDuplicate) {
            //     data.push({ name: action.payload.name, id: action.payload.id });
            // }
            // state.bluetooth = data;
            let data = []
            action.payload.bluetooth.map((device)=>{
                if(device?.name===undefined){
                    data.push({name : "undefined name", address : device.address})
                }else{
                    data.push(device)
                }
            })
            state.bluetooth = data

        },
        resetBluetooth : (state,action)=>{
            state.bluetooth = action.payload.bluetooth
        },

        setBluetoothKitchen: (state, action) => {
            let data = state.bluetoothkitchen ? state.bluetoothkitchen : []
            const isDuplicate = data.some(item => item.address === action.payload.bluetoothkitchen.address);
            if (!isDuplicate) {
                data.push(action.payload.bluetoothkitchen);
            }
            state.bluetoothkitchen = data;
        },
        removeBluetoothKitchen: (state, action) => {
            state.bluetoothkitchen = state.bluetoothkitchen.filter(bluetoothkitchen => bluetoothkitchen.address !== action.payload.address);
        },
        setBluetoothReceipt: (state, action) => {
            let data = state.bluetoothreceipt ? state.bluetoothreceipt : [];
            const isDuplicate = data.some(item => item.address === action.payload.bluetoothreceipt.address);
            if (!isDuplicate) {
                data.push(action.payload.bluetoothreceipt);
            }
            state.bluetoothreceipt = data;
        },
        removeBluetoothReceipt: (state, action) => {
            state.bluetoothreceipt = state.bluetoothreceipt.filter(bluetoothreceipt => bluetoothreceipt.address !== action.payload.address);
        },

    },
});

export const { setLan, setLanKitchen, setLanReceipt, removeLanKitchen, removeLanReceipt, setBluetooth, setBluetoothKitchen, removeBluetoothKitchen, setBluetoothReceipt, removeBluetoothReceipt,resetBluetooth } = printerSlice.actions;
