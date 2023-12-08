import { createSlice } from '@reduxjs/toolkit';
import { format } from 'date-fns';
// import { getDifference } from '../../../utils/utils-function';
export const OrdersState = {
    orders: [],
    onprogress: []
    // counterPending: []
};

function extractItems(items) {
    let data = []
    for (let i = 0; i < items.length; i++) {
        const optionsGroup = []
        for (let j = 0; j < items[i].options.length; j++) {
            const option = {
                _id: items[i].options[j]._id,
                id: items[i].options[j].id,
                name: items[i].options[j].name,
                price: items[i].options[j].price,
            }
            const idExistsIndex = optionsGroup.findIndex(item => item.optionGroupeId === items[i].options[j].optionGroupeId);
            if (idExistsIndex === -1) {
                optionsGroup.push({
                    optionGroupeId: items[i].options[j].optionGroupeId,
                    optionGroupeName: items[i].options[j].optionGroupeName,
                    options: [option]
                });
            } else {
                optionsGroup[idExistsIndex].options.push(option);
            }
        }
        data.push({
            id: items[i].id,
            _id: items[i]._id,
            name: items[i].name,
            description: items[i].description,
            price: items[i].price,
            quantity: items[i].quantity,
            tax: items[i].tax,
            optionsGroup: optionsGroup
        })
    }
    return data
}
export const ordersSlice = createSlice({
    name: 'orders',
    initialState: OrdersState,
    reducers: {
        setOrders: (state, action) => {
            let data = []
            for (let i = 0; i < action.payload.orders.length; i++) {
                const dateTime = new Date(action.payload.orders[i].createdAt);
                const dateWithoutTime = format(dateTime, 'yyyy-MM-dd')
                const timeWithoutSeconds = format(dateTime, 'HH:mm:ss')
                data[i] = {
                    id: action.payload.orders[i]._id,
                    name: action.payload.orders[i].client_first_name + " " + action.payload.orders[i].client_last_name,
                    client_email: action.payload.orders[i].client_email,
                    client_phone: action.payload.orders[i].client_phone,
                    deliveryAdress: action.payload.orders[i].deliveryAdress,
                    status: action.payload.orders[i].status,
                    date: dateWithoutTime,
                    time: timeWithoutSeconds,
                    price_total: action.payload.orders[i].price_total,
                    type: action.payload.orders[i].type,
                    currency: action.payload.currency,
                    items: extractItems(action.payload.orders[i].items),
                    table: action.payload.orders[i].table,
                    source: action.payload.orders[i].source
                }
            }
            state.orders = data
        },
        updateState: (state, action) => {
            let data = state.orders
            data[action.payload.index].status = action.payload.action
            state.orders = data
        },
        setOnProgress: (state, action) => {
            // change the status to accept
            let order = action.payload.order;
            let updatedOrder = { ...order, status: "accepted" };

            state.onprogress.push({
                order: updatedOrder,
                // I store this index to the screen orderDetailed..
                indexFromAllOrders: action.payload.indexFromAllOrders,
                // this boolean to hsow a counter in onprogress
                isClicked: false
            })
        },
        setOnProgressToClicked: (state) => {
            for (let i = 0; i < state.onprogress.length; i++) {
                state.onprogress[i].isClicked = true
            }
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



export const { setOrders, updateState, setOnProgress, setOnProgressToClicked } = ordersSlice.actions;
// decrementCounter
