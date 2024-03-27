import io from 'socket.io-client';
import { BaseUrl, store } from '.';
import { setWebhook } from './slices/Delivery/DeliverySlice';


export default function useSocket() {
    const socket = io("https://api.eatorder.fr")

    const joinRoom = function (data) {
        socket.emit("join_room", data)
    }
    const listenSocket = function () {
        socket.on("receive_data", (data) => {
            console.log(socket.id);
            console.log(data.data.status);
            store.dispatch(setWebhook({ uberId: data.data.delivery_id }))
        })
    }

    return { joinRoom, listenSocket };
}