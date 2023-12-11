import { createSlice } from '@reduxjs/toolkit';
import { format } from 'date-fns';
import { reformulateItems } from '../../../utils/utils-function';
export const OrdersState = {
    all: [],
    inprogress: [],
};

export const ordersSlice = createSlice({
    name: 'orders',
    initialState: OrdersState,
    reducers: {
        setOrders: (state, action) => {
            let data = action.payload.orders
            for (let i = 0; i < data.length; i++) {
                const dateTime = new Date(action.payload.orders[i].createdAt);
                const dateWithoutTime = format(dateTime, 'yyyy-MM-dd')
                const timeWithoutSeconds = format(dateTime, 'HH:mm')
                data[i] = {
                    ...data[i],
                    ...{
                        name: data[i].client_first_name + " " + data[i].client_last_name,
                        createdAt: {
                            date: dateWithoutTime,
                            time: timeWithoutSeconds,
                        },
                        currency: action.payload.currency,
                        items: reformulateItems(data[i].items),
                    }
                }
                delete data[i].client_first_name
                delete data[i].client_last_name
            }
            switch (action.payload.stage) {
                case "all": state.all = data
                case "inprogress": state.inprogress = data
            }
        },
        updateState: (state, action) => {
            const dateTime = new Date(action.payload.updatedAt);
            const dateWithoutTime = format(dateTime, 'yyyy-MM-dd')
            const timeWithoutSeconds = format(dateTime, 'HH:mm')
            switch (action.payload.stage) {
                case "all": {
                    let data = state.all
                    let newData = {
                        status: action.payload.action,
                        updatedAt: {
                            date: dateWithoutTime,
                            time: timeWithoutSeconds
                        },
                    }
                    if (action.payload.preparationTime) newData[preparationTime] = action.payload.preparationTime
                    data[action.payload.index] = {
                        ...data[action.payload.index],
                        ...newData
                    }
                    console.log(data[action.payload.index]);
                    state.all = data
                    // hnee
                }
                case "inprogress": {
                    let data = state.inprogress
                    data[action.payload.index] = {
                        ...data[action.payload.index],
                        status: action.payload.action,
                        updatedAt: {
                            date: dateWithoutTime,
                            time: timeWithoutSeconds
                        },
                    };
                    state.inprogress = data
                }
            }
        },
        // decrementCounter: (state, action) => {

        //     let index = state.counterPending.findIndex(item => item.id === action.payload.id)

        //     if (index !== -1) {
        //         if (state.counterPending[index].counter === 1) {
        //             state.orders[action.payload.index].status = "missed"
        //             // state.counterPending.splice(index, 1);
        //         } else {
        //             state.counterPending[index].counter = getDifference(state.orders[action.payload.index].time)
        //         }
        //     } else {
        //         state.counterPending.push({
        //             id: action.payload.id,
        //             counter: getDifference(state.orders[action.payload.index].time),
        //         })
        //     }
        // }
    },
});



export const { setOrders, updateState } = ordersSlice.actions;
// decrementCounter
