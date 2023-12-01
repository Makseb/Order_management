import { StyleSheet, Text, View, PixelRatio } from "react-native";
import React, { useEffect } from "react";
import { getAllOrdersByStroreId } from "../../../shared/slices/Orders/OrdersService";
import { useSelector } from "react-redux";

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';

import Icon from 'react-native-vector-icons/Ionicons';

export default function Orders() {
    const storeSelected = useSelector((state) => state.authentification.storeSelected)
    useEffect(() => {

        // this function will get all the orders that was related to the store choosen from login step
        const fetchAllOrdersByStroreId = async () => {
            console.log(storeSelected);
            await getAllOrdersByStroreId(storeSelected).then(res => {
                // console.log(res.orders);
                // navigation.navigate('Home')
            }).catch(err => {

            })
        }

        fetchAllOrdersByStroreId()

    }, [])


    return (
        <View style={styles.containerTitle}>
            <Text style={styles.title}>
                Orders
            </Text>

            <View style={styles.shadowHeader}>

                <View style={styles.containerHeader}>
                    <View style={[styles.containerPending,
                    {backgroundColor : 'red'}
                ]}>
                        <MaterialIcons name="schedule" size={24} color={'#df8f17'} />
                        <Text style={styles.pendingHeaderText}>Pending</Text>
                    </View>

                    <View style={[styles.containerProgress,
                        {backgroundColor : 'blue'}
                        ]}>
                        <View style={styles.barrHeader} />
                        <FontAwesome6 name="spinner" size={24} color={'#b7b7b7'} style={{ paddingLeft: '3%' }} />
                        <Text style={styles.progressHeaderText}>on progress</Text>
                    </View>

                    <View style={[styles.containerReady,
                        {backgroundColor : 'yellow'}
                        ]}>
                        <View style={styles.barrHeader} />
                        <MaterialIcons name="check-circle-outline" size={24} color={'#b7b7b7'} style={{ paddingLeft: '3%' }} />
                        <Text style={styles.readyHeaderText}>ready</Text>
                    </View>
                </View>
            </View>


            {/* second part */}

            {/* <View style={{ marginTop: '1%' }} /> */}


            {/* Pending */}
            <View style={styles.containerOrder}>
                <View style={styles.containerOrderLeft}>
                    <Icon name="bag-handle" size={40} color={'#333'} style={{ paddingRight: '1%' }} />
                    <View style={styles.containerTakeNameAndIconWithHerStatus}>
                        <Text style={styles.name}>Jhon Doe</Text>
                        <View style={styles.containerTakeIconWithHerStatus}>
                            <MaterialIcons name='more-horiz' size={16} style={{ color: '#fc0' }} />
                            <Text style={styles.status}> Pending</Text>
                        </View>
                    </View>
                </View>


                <View style={styles.containerRightOrder}>
                    <Text style={styles.textDateAndTime}>21/12/2023</Text>
                    <Text style={styles.textDateAndTime}>09:45</Text>
                    <Text style={styles.textPrice}>19.50€</Text>
                </View>
            </View>

            <View style={{ marginTop: '1%' }} />

            {/* Accepted */}
            <View style={styles.containerOrder}>
                <View style={styles.containerOrderLeft}>
                    <Icon name="bag-handle" size={40} color={'#333'} style={{ paddingRight: '1%' }} />
                    <View style={styles.containerTakeNameAndIconWithHerStatus}>
                        <Text style={styles.name}>Jhon Doe</Text>
                        <View style={styles.containerTakeIconWithHerStatus}>
                            <MaterialIcons name='done' size={16} style={{ color: '#5cd964' }} />
                            <Text style={[styles.status, { color: '#5cd964' }]}> Accepted</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.containerRightOrder}>
                    <Text style={styles.textDateAndTime}>21/12/2023</Text>
                    <Text style={styles.textDateAndTime}>09:45</Text>
                    <Text style={styles.textPrice}>19.50€</Text>
                </View>

            </View>

            <View style={{ marginTop: '1%' }} />

            {/* Rejected */}
            <View style={styles.containerOrder}>
                <View style={styles.containerOrderLeft}>
                    <Icon name="bag-handle" size={40} color={'#333'} style={{ paddingRight: '1%' }} />
                    <View style={styles.containerTakeNameAndIconWithHerStatus}>
                        <Text style={styles.name}>Jhon Doe</Text>
                        <View style={styles.containerTakeIconWithHerStatus}>
                            <MaterialIcons name='close' size={16} style={{ color: '#ff3b30' }} />
                            <Text style={[styles.status, { color: '#ff3b30' }]}> Rejected</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.containerRightOrder}>
                    <Text style={styles.textDateAndTime}>21/12/2023</Text>
                    <Text style={styles.textDateAndTime}>09:45</Text>
                    <Text style={styles.textPrice}>19.50€</Text>
                </View>

            </View>

            <View style={{ marginTop : '5%', marginLeft : '5%',paddingBottom: 5,overflow : 'hidden' }}>
                <View
                    style={{
                    }}
                />
            </View>






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
    shadowHeader : {
        overflow: 'hidden',
        marginHorizontal : '5%',
        paddingBottom : '1%', //shadow bottom 
        paddingRight : '0.2%', // shadow right
        // THIS STYLE FOR SHADOW BOTTOM AND RIGHT
    },
    containerHeader: {
        backgroundColor: '#fff',
        flexDirection : 'row',
        justifyContent : 'center',
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
        color: '#df8f17',
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
    containerOrder: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: '5%',
        borderBottomColor: '#f0f0f0',
        borderBottomWidth: 3,
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
        fontSize: 22,
        fontFamily: 'Roboto-Bold',
        color: '#030303'
    }

})