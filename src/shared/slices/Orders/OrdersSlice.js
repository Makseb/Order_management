import { createSlice } from '@reduxjs/toolkit';

export const OrdersState = {
    orders: undefined,
};

export const ordersSlice = createSlice({
    name: 'orders',
    initialState: OrdersState,
    reducers: {
        setOrders: (state, action) => {
            state.orders = action.payload
        }
    },
});

export const { setOrders } = ordersSlice.actions;
