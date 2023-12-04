import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/Ionicons';
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";

export default function Pendding({ state, dispatch }) {

    const navigation = useNavigation()

    // this function is used to show or not show buttons view and reject
    const [showButtons, setShowButtons] = useState([])
    const showButtonViewAndReject = (id, action, order) => {
        if (action === "pending") {
            setShowButtons((prevShowButtons) => {
                if (!prevShowButtons.includes(id)) {
                    return [...prevShowButtons, id];
                } else {
                    return prevShowButtons.filter((item) => item !== id);
                }
            })
        } else {
            navigation.navigate('OrderDetailed', order)
        }
    }

    // change state of order by rejecting
    const changeState = (event, index, action, id, order) => {

        event.stopPropagation()
        if (action === "view") {
            navigation.navigate('OrderDetailed', order)
        } else {
            dispatch({ type: 'updateState', payload: { index, action } })
        }
        showButtonViewAndReject(id, "pending")
    }

    return (
        <ScrollView>
            {
                state.orders != null && state.orders.map((order, index) => {
                    return (<View key={order.id} style={{
                        flexDirection: 'column',
                    }}>
                        {/* mapping orders */}
                        <TouchableWithoutFeedback onPress={() => showButtonViewAndReject(order.id, order.status, order)}>
                            <View style={styles.containerOrder} >

                                <View style={styles.containerOrderLeft}>
                                    <Icon name="bag-handle" size={40} color={'#333'} style={{ paddingRight: '1%' }} />
                                    <View style={styles.containerTakeNameAndIconWithHerStatus}>
                                        <Text style={styles.name}>{order.name}</Text>
                                        <View style={styles.containerTakeIconWithHerStatus}>
                                            <MaterialIcons name={
                                                (order.status === "accepted") ? 'done' :
                                                    (order.status === "rejected") ? 'close' :
                                                        'more-horiz'
                                            }
                                                size={16} style={{
                                                    color:
                                                        order.status === "accepted" ? "#5cd964" :
                                                            order.status === "rejected" ? "#ff3b30" :
                                                                "#fc0",
                                                }}
                                            />

                                            <Text style={
                                                (order.status === "accepted") ? [styles.status, { color: '#5cd964' }] :
                                                    (order.status === "rejected") ? [styles.status, { color: '#ff3b30' }] :
                                                        styles.status
                                            }> {order.status}</Text>
                                        </View>
                                    </View>
                                </View>


                                <View style={styles.containerRightOrder}>
                                    <Text style={styles.textDateAndTime}>{order.date}</Text>
                                    <Text style={styles.textDateAndTime}>{order.time}</Text>
                                    <Text style={styles.textPrice}>{order.price} {order.currency}</Text>
                                </View>

                            </View>
                        </TouchableWithoutFeedback>

                        {/* showing button view and reject if status pending */}
                        {
                            showButtons.includes(order.id) && (
                                <View style={{
                                    alignSelf: 'center',
                                    flexDirection: 'row',
                                }}>
                                    <TouchableOpacity onPress={(event) => { changeState(event, index, "view", order.id, order) }} style={styles.viewButton}>
                                        <Text style={styles.textViewButton}>View</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={(event) => changeState(event, index, "rejected", order.id)} style={styles.rejectButton}>
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