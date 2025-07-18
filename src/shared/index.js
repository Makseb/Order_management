import { combineReducers, createStore } from "@reduxjs/toolkit";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistStore, persistReducer } from 'redux-persist';

import { rootSlice } from "./slices/rootSlice"
import { authentificationSlice } from "./slices/Auth/AuthSlice";

export const BaseUrl = 'http://10.0.2.2:8000';


const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
};

const rootReducer = combineReducers({
    root: rootSlice.reducer,
    authentification: authentificationSlice.reducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(persistedReducer);

export const persistor = persistStore(store);
