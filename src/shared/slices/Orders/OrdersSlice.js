import { createSlice } from '@reduxjs/toolkit';
import { format } from 'date-fns';
import { reformulateItems } from '../../../utils/utils-function';
export const OrdersState = {
    all: [],
    inprogress: [],
    ready: [],
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
            if (action.payload.stage === "all") {
                if (action.payload.firstUpdate === true) {
                    console.log("eyy!!");
                    state.all = data
                } else {
                    state.all.push(...data);
                }

            } else if (action.payload.stage === "inprogress") {
                if (action.payload.firstUpdate === true) {
                    state.inprogress = data
                } else {
                    state.inprogress.push(...data);
                }

                // state.inprogress = data
            } else {
                if (action.payload.firstUpdate === true) {
                    state.ready = data
                } else {
                    state.ready.push(...data);
                }
                // state.ready = data
            }
        },
        updateState: (state, action) => {
            if (action.payload.stage === "all") {
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

                let order = state.all.find(order => order._id === action.payload.id)
                order = {
                    ...order,
                    ...newData
                }
                let data = state.all
                const index = state.all.findIndex(order => order._id === action.payload.id);
                data[index] = order
                state.all = data
            } else if (action.payload.stage === "inprogress") {
                let newData = {
                    status: action.payload.action,
                    updatedAt: {
                        date: format(new Date(action.payload.updatedAt), 'yyyy-MM-dd'),
                        time: format(new Date(action.payload.updatedAt), 'HH:mm')
                    },
                }
                let order = state.inprogress.find(order => order._id === action.payload.id)
                order = {
                    ...order,
                    ...newData
                }
                let data = state.inprogress
                const index = state.inprogress.findIndex(order => order._id === action.payload.id);
                data[index] = order
                state.inprogress = data

            }
        },
        deleteOrderFromInProgressStage: (state, action) => {
            state.inprogress = state.inprogress.filter((item) => item._id !== action.payload.id)
        }
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



export const { setOrders, updateState, deleteOrderFromInProgressStage, resetIncrement, setIncrement, resetIsNotification } = ordersSlice.actions;
// decrementCounter
