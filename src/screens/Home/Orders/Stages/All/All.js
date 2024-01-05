import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";

import { setOrders } from "../../../../../shared/slices/Orders/OrdersSlice";
import { useSelector } from "react-redux";
import { Order } from "../../../../../Components/exports";
import { getAllOrdersByStroreId } from "../../../../../shared/slices/Orders/OrdersService";
import { store } from "../../../../../shared";

import { RejectModal } from "./../../../../exports";

export default function All() {

    // get store selected
    const storeSelected = useSelector((state) => state.authentification.storeSelected._id)

    // get currency
    const currency = useSelector((state) => state.authentification.storeSelected.currency)

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

    // get the orders from redux
    const orders = useSelector((state) => state.orders.all)

    // this function is used to show or not show buttons view and reject
    const [showButtons, setShowButtons] = useState([])
    const showButtonViewAndReject = (id, action) => {
        if (action === "pending") {
            setShowButtons((prevShowButtons) => {
                if (!prevShowButtons.includes(id)) {
                    return [...prevShowButtons, id];
                } else {
                    return prevShowButtons.filter((item) => item !== id);
                }
            })
        } else {
            navigation.navigate('OrderDetailed', { id, stage: "all" })
        }
    }


    // change state of order by rejecting or view to the order detailed
    const changeState = (action, id, event, updatedAt) => {
        event.stopPropagation()
        if (action === "view") {
            navigation.navigate('OrderDetailed', { id, stage: "all" })
        }
    }

    const [toggleModal, setToggleModal] = useState({
        state: false,
        data: {
            id: undefined,
            stage: undefined,
            action: undefined
        }
    })

    return (
        <ScrollView>
            {toggleModal.state && <RejectModal modalProps={{ toggleModal, setToggleModal }} />}

            {
                orders.map((order, index) => {
                    return (<View key={order._id}>
                        <TouchableWithoutFeedback onPress={() => showButtonViewAndReject(order._id, order.status)} >
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
                                            <TouchableOpacity onPress={(event) => { changeState("view", order._id, event) }} style={styles.viewButton}>
                                                <Text style={styles.textViewButton}>View</Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity onPress={() => {
                                                setToggleModal({
                                                    state: true,
                                                    data: {
                                                        stage: "all",
                                                        action: "rejected",
                                                        id: order._id,
                                                    }
                                                })
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