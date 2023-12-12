import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { store } from "../../../../shared";
import { updateState } from "../../../../shared/slices/Orders/OrdersSlice";
import { Header } from "../../../exports"
import { updateOrderStatus } from "../../../../shared/slices/Orders/OrdersService";
import { AcceptModal } from "../../../../screens/exports";
import { ListSection } from "../../../../Components/exports";


export default function OrderDetailed({ route }) {
    const { index, stage } = route.params

    // get the order according to stage :"all" or "inprogress"
    const order = stage === "all" ? useSelector((state) => state.orders.all)[index] :
        useSelector((state) => state.orders.inprogress)[index]

    // open the detail of each title example (client details, fulfillment)
    const [expandeds, setExpandeds] = useState(null);

    // get currency
    const currency = useSelector((state) => state.authentification.storeSelected.currency)

    // show AcceptModal
    const [toggleModal, setToggleModal] = useState(false)

    const handlePress = (index) => {
        const newData = [...expandeds];
        newData[index] = !newData[index];
        setExpandeds(newData);
    }
    useEffect(() => {
        const initData = () => {
            let data = [];
            for (let i = 0; i < 3; i++) {
                if (i == 1) {
                    data.push(true)
                } else {
                    data.push(false)
                }
            }
            setExpandeds(data);
        };
        initData(); // Call the initialization function directly inside useEffect
    }, [])

    return (
        expandeds != null && <View style={styles.container}>
            <Header />
            <ScrollView>
                <View style={{
                    marginHorizontal: '5%',
                    flexDirection: 'column',
                }}>

                    <View style={{
                        flexDirection: 'row',
                        // justifyContent: 'space-between'
                    }}>
                        <Text style={[styles.orderIdText,{marginRight : '1%'}]}>Order ID : {order._id.substring(order._id.length - 4)}</Text>
                        {order.status !== "pending" && (
                            <View style={[styles.tag, { backgroundColor: order.status === "accepted" ? '#5cd964' : "#ff3b30" }]}>
                                <Text style={styles.textStatus}>
                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}</Text>
                            </View>
                        )}
                    </View>

                    {/* mapping product with options and without... */}

                    {/* List  Section*/}
                    {/* <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}> */}
                    <View style={{ width: '100%' }}>
                        <ListSection listProps={{ order, expandeds, handlePress }} />
                    </View>
                    <View style={{
                        width: '100%',
                        padding : '10%',
                        // marginLeft: '1%',
                        borderColor: '#7f7f7f',
                        elevation: 2,
                        // for ios
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.2,
                        shadowRadius: 1,
                    }}>
                        <View>
                            {
                                order.items.map((item, itemIndex) => (
                                    <React.Fragment key={itemIndex}>
                                        <View style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            marginBottom: "3%"
                                        }}>
                                            <Text style={{
                                                fontFamily: 'Montserrat-Regular',
                                                fontSize: 20,
                                                color: '#424242',
                                            }}>{item.quantity}x {item.name.charAt(0).toUpperCase() + item.name.slice(1)}</Text>
                                            <Text style={{
                                                fontFamily: 'Montserrat-Light',
                                                fontSize: 16,
                                                color: '#424242',
                                                fontStyle: 'italic',
                                            }}>{item.price} {currency}</Text>
                                        </View>
                                        {item.optionsGroup.map((optionGroup) => (
                                            <React.Fragment key={optionGroup.optionGroupeId}>
                                                <Text style={{
                                                    paddingLeft: 18,
                                                    fontFamily: 'Montserrat-Light',
                                                    fontSize: 18,
                                                    color: '#7f7f7f',
                                                }}>{optionGroup.optionGroupeName.charAt(0).toUpperCase() + optionGroup.optionGroupeName.slice(1)}</Text>
                                                {optionGroup.options.map((option, ind) => (
                                                    <View key={option._id} style={{
                                                        paddingLeft: 18,
                                                        flexDirection: 'row',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        marginBottom: ind === optionGroup.options.length - 1 && "3%"
                                                    }}>
                                                        <Text style={{
                                                            fontFamily: 'Montserrat-Light',
                                                            fontSize: 18,
                                                            color: '#424242',
                                                            fontStyle: 'italic',
                                                        }}>+{option.name.charAt(0).toUpperCase() + option.name.slice(1)}</Text>
                                                        <Text style={{
                                                            fontFamily: 'Montserrat-Light',
                                                            fontSize: 16,
                                                            color: '#424242',
                                                            fontStyle: 'italic',
                                                        }}>{option.price} {currency}</Text>

                                                    </View>
                                                ))}
                                            </React.Fragment>
                                        ))}
                                    </React.Fragment>
                                ))
                            }
                        </View>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between'
                        }}>
                            <Text></Text>
                            <Text style={{
                                fontFamily: 'Montserrat-Regular',
                                fontSize: 20,
                                color: '#424242',
                            }}>Total : {order.price_total} {currency}</Text>

                        </View>

                    </View>
                    {/* </View> */}

                    <View style={{ marginBottom: order.status !== "pending" && "3%" }} />

                    {/* Button reject and accept exist when order is pending */}
                    {
                        order.status === "pending" &&
                        <View style={styles.acceptRejectContainer}>
                            <TouchableOpacity style={styles.acceptButton} onPress={() => { setToggleModal(true) }}>
                                <Text style={styles.textAcceptButton}>Accept</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => {
                                // update status in backend to rejected
                                const updateOrderStatusToRejected = async () => {
                                    await updateOrderStatus({ status: "rejected", _id: order._id }).then(res => {
                                        store.dispatch(updateState({ index, action: "rejected", stage: stage, updatedAt: res.order.updatedAt }))
                                    }).catch(err => {
                                    })
                                }
                                updateOrderStatusToRejected()
                            }}
                                style={styles.rejectButton}>
                                <Text style={styles.textRejectButton}>Reject</Text>
                            </TouchableOpacity>
                        </View>
                    }

                    {/* show modal if toggleModal true */}
                    {toggleModal && (
                        <AcceptModal
                            modalProps={{
                                toggleModal,
                                setToggleModal,
                                stage,
                                index,
                                orderId: order._id,
                                preparedAt: order.preparedAt
                            }}
                        />
                    )}
                </View>

            </ScrollView>

        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    orderIdText: {
        color: '#030303',
        fontFamily: 'Montserrat-Light',
        fontSize: 14
    },
    tag: {
        width: 70,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 24,
    },
    textStatus: {
        color: 'white',
        fontFamily: 'Montserrat-Regular',
        fontSize: 12
    },
    acceptRejectContainer: {
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: '3%'
    },
    acceptButton: {
        height: 40,
        width: 150,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#5cd964',
        borderRadius: 24,
    },
    textAcceptButton: {
        color: 'white',
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
    },
    rejectButton: {
        height: 40,
        width: 150,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ff3b30',
        borderRadius: 24,
        marginLeft: '2%'
    },
    textRejectButton: {
        color: 'white',
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
    }
})