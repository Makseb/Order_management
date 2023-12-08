import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/Ionicons';
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";

import { setOrders, updateState } from "../../../../shared/slices/Orders/OrdersSlice";
import { store } from "../../../../shared";
import { useSelector } from "react-redux";
import { getAllOrdersByStroreId, updateOrderStatus } from "../../../../shared/slices/Orders/OrdersService";

export default function Pendding() {

    // get store selected
    const storeSelected = useSelector((state) => state.authentification.storeSelected._id)

    // get currency
    const currency = useSelector((state) => state.authentification.storeSelected.currency)

    // get the orders from redux
    const orders = useSelector((state) => state.orders.orders)

    // navigate between screens
    const navigation = useNavigation()

    useEffect(() => {
        // this function will get all the orders that was related to the store choosen from login step
        const fetchAllOrdersByStroreId = async () => {
            // console.log(storeSelected);
            await getAllOrdersByStroreId(storeSelected).then(res => {
                store.dispatch(setOrders({ orders: res.orders, currency: currency }))
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
            navigation.navigate('OrderDetailed', { index })
        }
    }


    // change state of order by rejecting or view to the order detailed
    const changeState = (action, index, event) => {
        event.stopPropagation()
        if (action === "view") {
            navigation.navigate('OrderDetailed', { index })
        } else {
            store.dispatch(updateState({ index, action }))
        }
    }

    return (
        <ScrollView>
            {
                orders.map((order, index) => {
                    return (<View key={order.id} style={{
                        flexDirection: 'column',
                    }}>
                        {/* mapping orders */}
                        <TouchableWithoutFeedback onPress={() => showButtonViewAndReject(order.id, order.status, index)}>
                            <View style={styles.containerOrder} >

                                <View style={styles.containerOrderLeft}>
                                    <Icon name="bag-handle" size={40} color={'#333'} style={{ paddingRight: '1%' }} />
                                    <View style={styles.containerTakeNameAndIconWithHerStatus}>
                                        <Text style={styles.name}>{order.name}</Text>
                                        <View style={styles.containerTakeIconWithHerStatus}>
                                            <MaterialIcons name={
                                                (order.status === "accepted") ? 'done' :
                                                    (order.status === "rejected") ? 'close' :
                                                        (order.status === "pending") ? 'more-horiz' :
                                                            'close'
                                            }
                                                size={16} style={{
                                                    color:
                                                        order.status === "accepted" ? "#5cd964" :
                                                            order.status === "rejected" ? "#ff3b30" :
                                                                order.status === "pending" ? "#fc0" :
                                                                    "#ff3b30",
                                                }}
                                            />
                                            <Text style={
                                                (order.status === "accepted") ? [styles.status, { color: '#5cd964' }] :
                                                    (order.status === "rejected") ? [styles.status, { color: '#ff3b30' }] :
                                                        (order.status === "missed") ? [styles.status, { color: '#ff3b30' }] :
                                                            styles.status
                                            }>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</Text>
                                            {/* order.status.charAt(0).toUpperCase() + order.status.slice(1) */}
                                        </View>
                                    </View>
                                </View>

                                <View style={styles.containerRightOrder}>
                                    <Text style={styles.textDateAndTime}>{order.date}</Text>
                                    <Text style={styles.textDateAndTime}>{order.time}</Text>
                                    <Text style={styles.textPrice}>{order.price_total} {order.currency}</Text>
                                </View>

                            </View>
                        </TouchableWithoutFeedback>

                        {/* showing button view and reject if status pending */}
                        {
                            showButtons.includes(order.id) && order.status === "pending" && (
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
                                            await updateOrderStatus({ status: "rejected", _id: order.id }).then(res => {
                                                changeState("rejected", index, event)

                                            }).catch(err => {
                                                console.log(order.id);
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
    containerOrder: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: '5%',
    },
    containerOrderLeft: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    containerTakeNameAndIconWithHerStatus: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    name: {
        fontSize: 16,
        fontFamily: 'Roboto-Regular',
        color: '#030303'
    },
    containerTakeIconWithHerStatus: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    status: {
        fontSize: 16,
        fontFamily: 'Roboto-Regular',
        color: '#fc0'
    },
    containerRightOrder: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    textDateAndTime: {
        fontSize: 14,
        fontFamily: 'Montserrat-Light',
        color: '#030303'
    },
    textPrice: {
        fontSize: 20,
        fontFamily: 'Roboto-Bold',
        color: '#030303'
    },
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
        marginVertical: '1%'
    }

})