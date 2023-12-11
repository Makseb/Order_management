import { StyleSheet, Text, View } from "react-native";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/Ionicons';

export default function Order({ order }) {
    return (<View style={styles.containerOrder} >
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
            <Text style={styles.textDateAndTime}>{order.createdAt.date}</Text>
            <Text style={styles.textDateAndTime}>{order.createdAt.time}</Text>
            <Text style={styles.textPrice}>{order.price_total} {order.currency}</Text>
        </View>

    </View>)
}
const styles = StyleSheet.create({
    containerOrder: {
        // backgroundColor : 'black',
        paddingVertical : '1%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        // marginHorizontal: '5%',
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
    }
})
