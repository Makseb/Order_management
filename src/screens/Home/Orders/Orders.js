import { StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import React, { useEffect, useState } from "react";

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';


import { All, InProgress, Ready } from "../../exports";
import EventSource from "react-native-sse";
import { setOrders } from "../../../shared/slices/Orders/OrdersSlice";
import { getAcceptedOrdersByStroreId, getAllOrdersByStroreId, getReadyOrdersByStroreId } from "../../../shared/slices/Orders/OrdersService";
import { BaseUrl, store } from "../../../shared";
import { useSelector } from "react-redux";
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import Sound from 'react-native-sound';


export default function Orders() {

    // Switch between all inprogress and ready
    const [switchButton, setSwitchButton] = useState("all")

    // switch stage using click event
    const SwitchBetweenAllInProgressReady = (event) => {
        setSwitchButton(event)
    }


    // get store selected
    const storeSelected = useSelector((state) => state.authentification.storeSelected.store._id)

    // get currency
    const currency = useSelector((state) => state.authentification.storeSelected.currency)

    // get notification id
    const notificationId = useSelector((state) => state.authentification.notificationId)

    // i use this when there is call for example the sound of notification will be in background
    Sound.setCategory('Playback', true);

    // get notifications in any stages
    useEffect(() => {

        const eventSource = new EventSource(BaseUrl + "/sse/sse/" + storeSelected + "/" + notificationId);

        const handleEventMessage = (data) => {
            if (!data.data.toLowerCase().includes("welcome")) {
                if (switchButton === "all") {
                    const fetchAllOrdersByStroreId = async () => {
                        await getAllOrdersByStroreId(storeSelected).then(res => {
                            store.dispatch(setOrders({ orders: res.orders, currency: currency, stage: "all" }))
                            if (data.data.includes("{")) {
                                Toast.show({
                                    type: 'success',
                                    text1: "Order has been changed from another interface.",
                                });
                            } else if (data.data.includes("Your order is missed")) {
                                Toast.show({
                                    type: 'error',
                                    text1: "The order is missed.",
                                });
                            } else {
                                Toast.show({
                                    type: 'success',
                                    text1: "Order received. 3 minutes and it will be missed.",
                                });
                            }
                            var whoosh = new Sound('sound.mp3', Sound.MAIN_BUNDLE, (error) => {
                                if (error) {
                                    return;
                                }
                                whoosh.play((success) => {
                                    if (success) {
                                    } else {
                                    }
                                });
                            });

                        }).catch(err => {
                        })
                    }
                    fetchAllOrdersByStroreId()
                } else if (switchButton === "inprogress") {
                    const fetchAcceptedOrdersByStroreId = async () => {
                        await getAcceptedOrdersByStroreId(storeSelected).then(res => {
                            store.dispatch(setOrders({ orders: res.orders, currency: currency, stage: "inprogress" }))
                            if (data.data.includes("{")) {
                                Toast.show({
                                    type: 'success',
                                    text1: "Order has been changed from another interface.",
                                });
                            } else if (data.data.includes("Your order is missed")) {
                                Toast.show({
                                    type: 'error',
                                    text1: "The order is missed.",
                                });
                            } else {
                                Toast.show({
                                    type: 'success',
                                    text1: "Order received. 3 minutes and it will be missed.",
                                });
                            }
                            var whoosh = new Sound('sound.mp3', Sound.MAIN_BUNDLE, (error) => {
                                if (error) {
                                    return;
                                }
                                whoosh.play((success) => {
                                    if (success) {
                                    } else {
                                    }
                                });
                            });
                        }).catch(err => {
                        })
                    }
                    fetchAcceptedOrdersByStroreId()
                } else {
                    const fetchReadyOrdersByStroreId = async () => {
                        await getReadyOrdersByStroreId(storeSelected).then(res => {
                            store.dispatch(setOrders({ orders: res.orders, currency: currency, stage: "ready" }))
                            if (data.data.includes("{")) {
                                Toast.show({
                                    type: 'success',
                                    text1: "Order has been changed from another interface.",
                                });
                            } else if (data.data.includes("Your order is missed")) {
                                Toast.show({
                                    type: 'error',
                                    text1: "The order is missed.",
                                });
                            } else {
                                Toast.show({
                                    type: 'success',
                                    text1: "Order received. 3 minutes and it will be missed.",
                                });
                            }
                            var whoosh = new Sound('sound.mp3', Sound.MAIN_BUNDLE, (error) => {
                                if (error) {
                                    return;
                                }
                                whoosh.play((success) => {
                                    if (success) {
                                    } else {
                                    }
                                });
                            });

                        }).catch(err => {
                        })
                    }
                    fetchReadyOrdersByStroreId()
                }
            }
        }

        // Grab all events with the type of 'message'
        eventSource.addEventListener('message', (data) => {
            handleEventMessage(data)
        });

        return () => {
            // Log that the component is unmounting
            console.log('Restaurant App is unmounting...');
            // Remove the event listener and close the connection
            console.log('Removing event listener and closing EventSource connection...');
            eventSource.removeEventListener('message', handleEventMessage);
            eventSource.close();
        };

    }, [switchButton]);


    return (
        <View style={styles.containerTitle}>

            <Text style={styles.title}>
                Orders
            </Text>
            {/* show toast if notification arrive */}
            <View style={{ overflow: 'hidden' }}>
                <View style={styles.containerHeader}>
                    {/* All */}
                    <TouchableWithoutFeedback onPress={() => SwitchBetweenAllInProgressReady("all")}>
                        <View style={[styles.containerAll,
                            // { backgroundColor: 'yellow' }
                        ]}>
                            <MaterialIcons name="schedule" size={24} color={switchButton === "all" ? '#df8f17' : '#b7b7b7'} />
                            <Text style={[styles.headerText, { color: switchButton === 'all' ? '#df8f17' : '#b7b7b7' }]}>All</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    {/* In Progress */}

                    <View style={{
                        justifyContent: 'center',
                    }}>
                        <View style={styles.barrHeader} />
                    </View>

                    <TouchableWithoutFeedback onPress={() => SwitchBetweenAllInProgressReady("inprogress")}>
                        <View style={[styles.containerInProgress,
                            // { backgroundColor: 'blue' }
                        ]}>
                            <FontAwesome6 name="spinner" size={24} color={switchButton === "inprogress" ? '#df8f17' : '#b7b7b7'} style={{ paddingLeft: '3%' }} />
                            <Text style={[styles.headerText, { color: switchButton === 'inprogress' ? '#df8f17' : '#b7b7b7' }]}>In progress</Text>
                        </View>
                    </TouchableWithoutFeedback>

                    {/* Ready */}
                    <View style={{
                        justifyContent: 'center',
                    }}>
                        <View style={styles.barrHeader} />
                    </View>
                    <TouchableWithoutFeedback onPress={() => SwitchBetweenAllInProgressReady("ready")}>
                        <View style={[styles.containerReady,
                            // { backgroundColor: 'yellow' }
                        ]}>
                            <MaterialIcons name="check-circle-outline" size={24} color={switchButton === "ready" ? '#df8f17' : '#b7b7b7'} style={{ paddingLeft: '3%' }} />
                            <Text style={[styles.headerText, { color: switchButton === 'ready' ? '#df8f17' : '#b7b7b7' }]}>Ready</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
                {/* second part */}
                {
                    switchButton === "all" ? <All /> :
                        switchButton === "inprogress" ? <InProgress /> :
                            <Ready />
                }

            </View >
        </View>
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
        // marginBottom : 1, // 
        marginHorizontal: '5%',
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'center',
        height: 49,
        shadowColor: "#030303",
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 6,
        shadowOpacity: 0.8,
        elevation: 3,
    },
    containerAll: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    headerText: {
        fontSize: 14,
        fontFamily: 'Montserrat-Light',
        color: '#b7b7b7',
        paddingLeft: '2%'
    },
    containerInProgress: {
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
    containerReady: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
})