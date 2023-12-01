import AsyncStorage from '@react-native-async-storage/async-storage'; // for disconnect
import { createSlice } from '@reduxjs/toolkit';

export const AuthentificationInitialState = {
    loggedInUser: undefined,
    isLoggedIn: false,
    userId: undefined,
    token: undefined,
    storeSelected: undefined
};

export const authentificationSlice = createSlice({
    name: 'authentification',
    initialState: AuthentificationInitialState,
    reducers: {
        setLoggedInUser: (state, action) => {
            state.isLoggedIn = true;

            // here i will delete password from user object
            const user = action.payload.user
            delete user.password

            state.loggedInUser = user;

            state.userId = action.payload.user._id;
        },
        setToken: (state, action) => {
            state.token = action.payload.token;
        },
        setStoreSelected: (state, action) => {
            state.storeSelected = action.payload
        },
        disconnect: (state) => {
            state.loggedInUser = undefined,
                state.isLoggedIn = false,
                state.userId = undefined,
                state.token = undefined,
                state.storeSelected = undefined

        },

    },
});

export const { setLoggedInUser, setToken, disconnect, setStoreSelected } = authentificationSlice.actions;
