import { combineReducers, createStore } from "@reduxjs/toolkit";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistStore, persistReducer } from 'redux-persist';

import { rootSlice } from "./slices/rootSlice"
import { authentificationSlice } from "./slices/Auth/AuthSlice";
import { ordersSlice } from "./slices/Orders/OrdersSlice";
import { availabilitySlice } from "./slices/Availability/AvailabilitySlice";
import { printerSlice } from "./slices/Printer/PrinterSlice";
import { languagesSlice } from "./slices/Languages/LanguagesSlice";

export const BaseUrl = 'http://192.168.1.51:8000';
// https://api.eatorder.fr

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: ['root', 'authentification','printer','languages'],
};

const rootReducer = combineReducers({
    root: rootSlice.reducer,
    authentification: authentificationSlice.reducer,
    orders: ordersSlice.reducer,
    availability: availabilitySlice.reducer,
    printer: printerSlice.reducer,
    languages: languagesSlice.reducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(persistedReducer);

export const persistor = persistStore(store);
