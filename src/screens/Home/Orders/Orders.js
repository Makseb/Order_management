import { StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import React, { useState } from "react";

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';


import { All, InProgress, Ready } from "../../exports";


export default function Orders() {
    // Switch between all inprogress and ready
    const [switchButton, setSwitchButton] = useState("all")

    // switch stage using click event
    const SwitchBetweenAllInProgressReady = (event) => {
        setSwitchButton(event)
    }

    return (
        <View style={styles.containerTitle}>
            <Text style={styles.title}>
                Orders
            </Text>


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
        marginHorizontal: '5%',
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'center',
        height: 49,
        shadowColor: "black",
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