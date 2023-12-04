import { StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import React, { useEffect, useReducer, useState } from "react";

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { format } from 'date-fns';



import { getAllOrdersByStroreId } from "../../../shared/slices/Orders/OrdersService";
import { useSelector } from "react-redux";
import { Pendding, OnProgress, Ready } from "../../exports";

// import { Skeleton } from '@rneui/themed';
// import LinearGradient from 'react-native-linear-gradient';




export default function Orders() {
    function reducer(state, action) {
        switch (action.type) {
            case "setOrders": {
                let data = []
                for (let i = 0; i < action.payload.length; i++) {
                    const dateTime = new Date(action.payload[i].createdAt);
                    const dateWithoutTime = format(dateTime, 'yyyy-MM-dd')
                    const timeWithoutSeconds = format(dateTime, 'HH:mm')
                    data[i] = {
                        id: action.payload[i]._id,
                        name: action.payload[i].client_first_name + " " + action.payload[i].client_last_name,
                        client_email : action.payload[i].client_email,
                        deliveryAdress : action.payload[i].deliveryAdress,
                        status: action.payload[i].status,
                        date: dateWithoutTime,
                        time: timeWithoutSeconds,
                        price: action.payload[i].price_total,
                        type: action.payload[i].type,
                        currency: currency,
                        items : action.payload[i].items,
                    }
                }
                return {
                    ...state,
                    orders: data
                }
            }
            case "updateState": {
                let data = state.orders
                data[action.payload.index].status = action.payload.action
                console.log(data[action.payload.index]);
                return {
                    ...state,
                    orders: data
                }
            }
            default: return state

        }
    }

    // get store selected
    const storeSelected = useSelector((state) => state.authentification.storeSelected._id)

    // get the currency of store selected
    const currency = useSelector((state) => state.authentification.storeSelected.currency)

    // manage data of orders in reducer function above
    const [state, dispatch] = useReducer(reducer, { orders : null });

    useEffect(() => {

        // this function will get all the orders that was related to the store choosen from login step
        const fetchAllOrdersByStroreId = async () => {
            // console.log(storeSelected);
            await getAllOrdersByStroreId(storeSelected).then(res => {
                dispatch({ type: 'setOrders', payload: res.orders })
            }).catch(err => {

            })
        }

        fetchAllOrdersByStroreId()

    }, [])

    // Switch between pending onprogress and ready
    const [switchButton, setSwitchButton] = useState("Pending")
    const SwitchBetweenPendingOnProgressReady = (event) => {
        setSwitchButton(event)
    }

    return (
        <View style={styles.containerTitle}>
            <Text style={styles.title}>
                Orders
            </Text>


            <View style={styles.shadowHeader}>

                <View style={styles.containerHeader}>
                    {/* Pending */}
                    <TouchableWithoutFeedback onPress={() => SwitchBetweenPendingOnProgressReady("Pending")}>
                        <View style={[styles.containerPending,
                            // { backgroundColor: 'red' }
                        ]}>
                            <MaterialIcons name="schedule" size={24} color={switchButton === "Pending" ? '#df8f17' : '#b7b7b7'} />
                            <Text style={[styles.pendingHeaderText, { color: switchButton === 'Pending' ? '#df8f17' : '#b7b7b7' }]}>Pending</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    {/* On Progress */}


                    <TouchableWithoutFeedback onPress={() => SwitchBetweenPendingOnProgressReady("OnProgress")}>
                        <View style={[styles.containerProgress,
                            // { backgroundColor: 'blue' }
                        ]}>
                            <View style={styles.barrHeader} />
                            <FontAwesome6 name="spinner" size={24} color={switchButton === "OnProgress" ? '#df8f17' : '#b7b7b7'} style={{ paddingLeft: '3%' }} />
                            <Text style={[styles.pendingHeaderText, { color: switchButton === 'OnProgress' ? '#df8f17' : '#b7b7b7' }]}>On progress</Text>
                        </View>
                    </TouchableWithoutFeedback>

                    {/* Ready */}

                    <TouchableWithoutFeedback onPress={() => SwitchBetweenPendingOnProgressReady("Ready")}>
                        <View style={[styles.containerReady,
                            // { backgroundColor: 'yellow' }
                        ]}>
                            <View style={styles.barrHeader} />
                            <MaterialIcons name="check-circle-outline" size={24} color={switchButton === "Ready" ? '#df8f17' : '#b7b7b7'} style={{ paddingLeft: '3%' }} />
                            <Text style={[styles.pendingHeaderText, { color: switchButton === 'Ready' ? '#df8f17' : '#b7b7b7' }]}>Ready</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </View>

            {/* second part */}
            {
                switchButton === "Pending" ? <Pendding state={state} dispatch={dispatch} /> :
                    switchButton === "OnProgress" ? <OnProgress /> : <Ready />
            }

        </View >
    );
}


const styles = StyleSheet.create({
    containerTitle: {
        flex: 1,
        backgroundColor: 'white'
    },
    title: {
        marginLeft: '5%',
        marginBottom: '2%',
        color: '#030303',
        fontSize: 20,
        fontFamily: 'Montserrat-Regular'
    },
    shadowHeader: {
        overflow: 'hidden',
        marginHorizontal: '5%',
        paddingBottom: '1%', //shadow bottom 
        // paddingRight: '0.1%', // shadow right
        // THIS STYLE FOR SHADOW BOTTOM AND RIGHT
    },
    containerHeader: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'center',
        height: 49,
        shadowColor: '#000',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.4,
        shadowRadius: 3,
        elevation: 5,
    },
    containerPending: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    pendingHeaderText: {
        fontSize: 14,
        fontFamily: 'Montserrat-Light',
        color: '#b7b7b7',
        paddingLeft: '2%'
    },
    containerProgress: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    barrHeader: {
        width: 2,
        height: '50%',
        backgroundColor: '#b7b7b7',
    },
    progressHeaderText: {
        fontSize: 14,
        fontFamily: 'Montserrat-Light',
        color: '#b7b7b7',
        paddingLeft: '2%'
    },
    containerReady: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    readyHeaderText: {
        fontSize: 14,
        fontFamily: 'Montserrat-Light',
        color: '#b7b7b7',
        paddingLeft: '2%'
    },

    /* second part (container) */

})