import AsyncStorage from '@react-native-async-storage/async-storage'; // for disconnect
import { createSlice } from '@reduxjs/toolkit';

export const AuthentificationInitialState = {
    loggedInUser: undefined,
    isLoggedIn: false,
    userId: undefined,
    token: undefined
};

export const authentificationSlice = createSlice({
    name: 'authentification',
    initialState: AuthentificationInitialState,
    reducers: {
        setLoggedInUser: (state, action) => {
            state.isLoggedIn = true;
            state.loggedInUser = action.payload.user;
            state.userId = action.payload.user._id;
        },
        setToken: (state, action) => {
            state.token = action.payload.token;
        },
    },
});

export const { setLoggedInUser, setToken } = authentificationSlice.actions;
