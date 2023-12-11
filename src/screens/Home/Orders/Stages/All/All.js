import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";

import { setOrders, updateState } from "../../../../../shared/slices/Orders/OrdersSlice";
import { useSelector } from "react-redux";
import { Order } from "../../../../../Components/exports";
import { getAllOrdersByStroreId, updateOrderStatus } from "../../../../../shared/slices/Orders/OrdersService";
import { store } from "../../../../../shared";

export default function All() {

    // get store selected
    const storeSelected = useSelector((state) => state.authentification.storeSelected._id)

    // get currency
    const currency = useSelector((state) => state.authentification.storeSelected.currency)

    // get the orders from redux
    const orders = useSelector((state) => state.orders.all)

    // navigate between screens
    const navigation = useNavigation()

    useEffect(() => {
        // this function will get the all orders that was related to the store choosen from login step
        const fetchAllOrdersByStroreId = async () => {
            // console.log(storeSelected);
            await getAllOrdersByStroreId(storeSelected).then(res => {
                store.dispatch(setOrders({ orders: res.orders, currency: currency, stage: "all" }))
            }).catch(err => {
            })
        }
        fetchAllOrdersByStroreId()
    }, [])


    // this function is used to show or not show buttons view and reject
    const [showButtons, setShowButtons] = useState([])
    const showButtonViewAndReject = (id, action, index) => {
        if (action === "pending") {
            setShowButtons((prevShowButtons) => {
                if (!prevShowButtons.includes(id)) {
                    return [...prevShowButtons, id];
                } else {
                    return prevShowButtons.filter((item) => item !== id);
                }
            })
        } else {
            navigation.navigate('OrderDetailed', { index, stage: "all" })
        }
    }


    // change state of order by rejecting or view to the order detailed
    const changeState = (action, index, event, updatedAt) => {
        event.stopPropagation()
        if (action === "view") {
            navigation.navigate('OrderDetailed', { index, stage: "all" })
        } else {
            console.log(updatedAt);
            store.dispatch(updateState({ index, action, stage: "all", updatedAt }))
        }
    }

    return (
        <ScrollView>
            {
                orders.map((order, index) => {
                    return (<View key={order._id}>
                        <TouchableWithoutFeedback onPress={() => showButtonViewAndReject(order._id, order.status, index)} >
                            <View style={{ marginHorizontal: '5%' }}>
                                {/* mapping orders */}
                                <Order order={order} />
                                {/* showing button view and reject if status pending */}
                                {
                                    showButtons.includes(order._id) && order.status === "pending" && (
                                        <View style={{
                                            alignSelf: 'center',
                                            flexDirection: 'row',
                                        }}>
                                            <TouchableOpacity onPress={(event) => { changeState("view", index, event) }} style={styles.viewButton}>
                                                <Text style={styles.textViewButton}>View</Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity onPress={(event) => {
                                                // update status in backend to rejected
                                                const updateOrderStatusToRejected = async () => {
                                                    await updateOrderStatus({ status: "rejected", _id: order._id }).then(res => {
                                                        changeState("rejected", index, event, res.order.updatedAt)
                                                    }).catch(err => {
                                                        console.log(order._id);
                                                        console.log(err);
                                                    })
                                                }
                                                // this cauz theris two func
                                                event.persist();
                                                updateOrderStatusToRejected()
                                            }} style={styles.rejectButton}>
                                                <Text style={styles.textRejectButton}>Reject</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )
                                }
                            </View>
                        </TouchableWithoutFeedback>
                        {/* bar that separate orders */}
                        < View style={styles.barSeparateOrder} />
                    </View>
                    )
                })
            }
        </ScrollView >
    )
}

const styles = StyleSheet.create({
    viewButton: {
        height: 25,
        width: 100,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#7f7f7f',
        borderRadius: 24,
    },
    textViewButton: {
        color: 'white',
        fontFamily: 'Montserrat-Regular',
        fontSize: 12,
    },
    rejectButton: {
        height: 25,
        width: 100,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ff3b30',
        borderRadius: 24,
        marginLeft: '1%',

        marginBottom: '1%'
    },
    textRejectButton: {
        color: 'white',
        fontFamily: 'Montserrat-Regular',
        fontSize: 12,
    },
    barSeparateOrder: {
        borderBottomColor: '#f0f0f0',
        borderBottomWidth: 3,
        marginHorizontal: '5%',
    }
})