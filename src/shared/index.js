import { combineReducers, createStore } from "@reduxjs/toolkit";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistStore, persistReducer } from 'redux-persist';

import { rootSlice } from "./slices/rootSlice"
import { authentificationSlice } from "./slices/Auth/AuthSlice";
import { ordersSlice } from "./slices/Orders/OrdersSlice";
import { availabilitySlice } from "./slices/Availability/AvailabilitySlice";
import { printerSlice } from "./slices/Printer/PrinterSlice";
import { languagesSlice } from "./slices/Languages/LanguagesSlice";
import { deliverySlice } from "./slices/Delivery/DeliverySlice";

export const BaseUrl = 'https://api.eatorder.fr';
// https://api.eatorder.fr
// 'http://192.168.1.114:8000'
const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: ['root', 'authentification', 'printer', 'languages'],
};
// ,'delivery'
const rootReducer = combineReducers({
    root: rootSlice.reducer,
    authentification: authentificationSlice.reducer,
    orders: ordersSlice.reducer,
    availability: availabilitySlice.reducer,
    printer: printerSlice.reducer,
    languages: languagesSlice.reducer,
    delivery: deliverySlice.reducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(persistedReducer);

export const persistor = persistStore(store);
