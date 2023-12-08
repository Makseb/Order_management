import { StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import React, { useState } from "react";

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import { Pendding, OnProgress, Ready } from "../../exports";
import { useSelector } from "react-redux";
import { setOnProgressToClicked } from "../../../shared/slices/Orders/OrdersSlice";
import { store } from "../../../shared";


export default function Orders() {

    // Switch between pending onprogress and ready
    const [switchButton, setSwitchButton] = useState("Pending")
    const SwitchBetweenPendingOnProgressReady = (event) => {
        if (event === "OnProgress") {
            store.dispatch(setOnProgressToClicked())
        }
        setSwitchButton(event)
    }

    // get the orders that were in progress
    const ordersOnProgress = useSelector((state) => state.orders.onprogress)

    console.log(ordersOnProgress.some(order => order.isClicked === false))
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
                            <View>
                                {/* this for showing badge to tell the user there is an order in on progress */}
                                {ordersOnProgress.some(order => order.isClicked === false) && <MaterialCommunityIcons name="bell-badge" size={20} style={{
                                    position: 'absolute', top: -15, right: -10, color: '#df8f17'
                                }} />}
                                <FontAwesome6 name="spinner" size={24} color={switchButton === "OnProgress" ? '#df8f17' : '#b7b7b7'} style={{ paddingLeft: '3%' }} />
                            </View>

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
                switchButton === "Pending" ? <Pendding /> :
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

})