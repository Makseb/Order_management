import { StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { DeliveryModal } from "../exports";
import { useSelector } from "react-redux";

export default function Order({ order }) {
    const { t: translation } = useTranslation();
    const [toggleModal, setToggleModal] = useState({
        state: false,
        orderId: undefined
    })

    const organizations = useSelector((state) => state.delivery.organizations)

    // this function caluculate how many checked (manual,automatic) in each delivery organization 
    const checkedCount = organizations.reduce((acc, org) => {
        return acc + org.options.filter(option => option.checked).length;
    }, 0);


    return (<View style={styles.containerOrder} >

        <View style={styles.containerOrderLeft}>
            <Icon name="bag-handle" size={
                40
                // 30
            } color={'#333'} style={{}} />
            <View style={styles.containerTakeNameAndIconWithHerStatus}>

                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={styles.name}>{order.name}</Text>
                    <View style={[styles.tag, {
                        marginLeft: 5,
                        backgroundColor: (order.paymentStatus === "Paid") ? "#5cd964" : "#ff3b30"
                    }]}>
                        <Text style={styles.textStatus}>
                            {order.paymentStatus === "Paid" ? translation("Paid") : translation("Unpaid")}
                        </Text>
                    </View>
                </View>

                <View style={styles.containerTakeIconWithHerStatus}>
                    <MaterialIcons name={
                        (order.status === "accepted" || order.status === "ready") ? 'done' :
                            (order.status === "rejected") ? 'close' : (order.status === "pending") ? "more-horiz" :
                                'close'
                    }
                        size={16} style={{
                            color:
                                (order.status === "accepted" || order.status === "ready") ? "#5cd964" :
                                    order.status === "rejected" ? "#ff3b30" : order.status === "pending" ? "#fc0" :
                                        "#ff3b30"
                        }}
                    />
                    <Text style={
                        (order.status === "accepted" || order.status === "ready") ? [styles.status, { color: '#5cd964' }] :
                            (order.status === "rejected") ? [styles.status, { color: '#ff3b30' }] :
                                (order.status === "missed") ? [styles.status, { color: '#ff3b30' }] :
                                    styles.status
                    }>{translation(order.status.charAt(0).toUpperCase() + order.status.slice(1))}</Text>
                </View>
            </View>
        </View>

        <View style={{
            flexDirection: "row",
            alignItems: "center"
        }}>
            {order.type === "Delivery" && checkedCount > 0 && <TouchableWithoutFeedback onPress={() => {
                setToggleModal({
                    state: true,
                    orderId: order._id
                })
            }}>
                <View style={{
                    marginRight: 5,
                    backgroundColor: "#5cd964",
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 5,
                    width: 50,
                    height: 45
                }}>
                    <MaterialIcons name="delivery-dining" color="white" style={{
                        fontSize: 15
                    }} />
                    <Text style={{
                        color: 'white',
                        fontFamily: 'Roboto-Bold',
                        fontSize: 10
                    }}>{translation("Delevery")}</Text>
                </View>
            </TouchableWithoutFeedback>}
            <View style={styles.containerRightOrder}>
                <Text style={styles.textDateAndTime}>{order.createdAt.date}</Text>
                <Text style={styles.textDateAndTime}>{order.createdAt.time}</Text>
                <Text style={styles.textPrice}>{order.price_total} {order.currency}</Text>
            </View>
        </View>
        {toggleModal.state && <DeliveryModal toggleModal={toggleModal} setToggleModal={setToggleModal} />}

    </View>)
}
const styles = StyleSheet.create({

    containerOrder: {
        // backgroundColor : "red",
        paddingVertical: '1%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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
    tag: {
        width: 70,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 24,
    },

    textStatus: {
        color: 'white',
        fontFamily: 'Roboto-Regular',
        fontSize: 12
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
