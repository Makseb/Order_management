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
                let newData = {
                    name: data[i].client_first_name + " " + data[i].client_last_name,
                    createdAt: {
                        date: format(new Date(action.payload.orders[i].createdAt), 'yyyy-MM-dd'),
                        time: format(new Date(action.payload.orders[i].createdAt), 'HH:mm'),
                    },
                    currency: action.payload.currency,
                    items: reformulateItems(data[i].items),
                }
                if (data[i].preparedAt) data[i].preparedAt = {
                    date: format(new Date(data[i].preparedAt), 'yyyy-MM-dd'),
                    time: format(new Date(data[i].preparedAt), 'HH:mm'),
                }
                if (data[i].updatedAt) data[i].updatedAt = {
                    date: format(new Date(data[i].updatedAt), 'yyyy-MM-dd'),
                    time: format(new Date(data[i].updatedAt), 'HH:mm'),
                }
                data[i] = {
                    ...data[i],
                    ...newData
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
            switch (action.payload.stage) {
                case "all": {
                    let data = state.all
                    let newData = {
                        status: action.payload.action,
                        updatedAt: {
                            date: format(new Date(action.payload.updatedAt), 'yyyy-MM-dd'),
                            time: format(new Date(action.payload.updatedAt), 'HH:mm')
                        },
                    }
                    if (action.payload.preparedAt) newData.preparedAt = {
                        date: format(new Date(action.payload.preparedAt), 'yyyy-MM-dd'),
                        time: format(new Date(action.payload.preparedAt), 'HH:mm')
                    }
                    data[action.payload.index] = {
                        ...data[action.payload.index],
                        ...newData
                    }
                    state.all = data
                }
                // case "inprogress": {
                //     let data = state.inprogress
                //     data[action.payload.index] = {
                //         ...data[action.payload.index],
                //         status: action.payload.action,
                //         updatedAt: {
                //             date: dateWithoutTime,
                //             time: timeWithoutSeconds
                //         },
                //     };
                //     state.inprogress = data
                // }
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
