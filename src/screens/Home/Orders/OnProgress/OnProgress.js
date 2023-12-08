import { Text, View, ScrollView, TouchableWithoutFeedback, StyleSheet } from "react-native";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/Ionicons';

import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

export default function OnProgress() {
    // get the orders that were in progress
    const ordersOnProgress = useSelector((state) => state.orders.onprogress)

    const showButtonViewAndReject = (index) => {
        navigation.navigate('OrderDetailed', { index })
    }
    // navigate between screens
    const navigation = useNavigation()
    
    console.log(ordersOnProgress);
    return (
        <ScrollView>
            {
                ordersOnProgress.map((orderMap, index) => {
                    const order = orderMap.order
                    return (<View key={order.id} style={{
                        flexDirection: 'column',
                    }}>
                        {/* mapping orders */}
                        <TouchableWithoutFeedback onPress={() => showButtonViewAndReject(orderMap.indexFromAllOrders)}>
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
                        {/* bar that separate orders */}
                        < View style={styles.barSeparateOrder} />
                    </View>

                    )
                })
            }
        </ScrollView >

    );

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
    barSeparateOrder: {
        borderBottomColor: '#f0f0f0',
        borderBottomWidth: 3,
        marginHorizontal: '5%',
        marginVertical: '1%'
    }

})