import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { Header } from "../../../exports"

import { List } from 'react-native-paper';
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { store } from "../../../../shared";
import { updateState } from "../../../../shared/slices/Orders/OrdersSlice";

import { updateOrderStatus } from "../../../../shared/slices/Orders/OrdersService";
import { AcceptModal } from "../../../../Components/exports";


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
                if (i == 0) {
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
                        justifyContent: 'space-between'
                    }}>
                        <Text style={styles.orderIdText}>Order ID : {order._id.substring(order._id.length - 4)}</Text>

                        <View style={{
                            flexDirection: 'row',
                        }}>
                            {order.status !== "pending" && (
                                <View style={[styles.tag, { backgroundColor: order.status === "accepted" ? '#5cd964' : "#ff3b30" }]}>
                                    <Text style={styles.textStatus}>
                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}</Text>
                                </View>
                            )}
                            <Text style={styles.textDateAndTime}>{order.createdAt.date} {order.createdAt.time}</Text>
                            {/* <Text style={styles.textDateAndTime}>{order.updatedAt.toString()}</Text> */}
                        </View>
                    </View>

                    {/* mapping product with options and without... */}
                    <View style={{
                        padding: '5%',
                        borderColor: 'gray',
                        elevation: 2,
                        // for ios
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.2,
                        shadowRadius: 2,
                    }}>
                        <View>
                            {
                                order.items.map((item, itemIndex) => (
                                    <React.Fragment key={itemIndex}>
                                        <Text style={{
                                            fontFamily: 'Inconsolata-Bold',
                                            fontSize: 24,
                                            color: '#424242',
                                        }}>-{item.name.charAt(0).toUpperCase() + item.name.slice(1)}</Text>
                                        {item.optionsGroup.map((optionGroup) => (
                                            <React.Fragment key={optionGroup.optionGroupeId}>
                                                <Text style={{
                                                    paddingLeft: 18,
                                                    fontFamily: 'Inconsolata-Bold',
                                                    fontSize: 18,
                                                    color: '#424242',
                                                }}>{optionGroup.optionGroupeName.charAt(0).toUpperCase() + optionGroup.optionGroupeName.slice(1)}</Text>
                                                {optionGroup.options.map((option) => (
                                                    <View key={option._id} style={{
                                                        paddingLeft: 36,
                                                        flexDirection: 'row',
                                                        justifyContent: 'space-between'
                                                    }}>
                                                        <Text style={{
                                                            fontFamily: 'Inconsolata-Regular',
                                                            fontSize: 16,
                                                            color: '#424242',
                                                            fontStyle: 'italic'
                                                        }}>+{option.name.charAt(0).toUpperCase() + option.name.slice(1)}</Text>
                                                        <Text style={{
                                                            fontFamily: 'Inconsolata-Regular',
                                                            fontSize: 16,
                                                            color: '#424242',
                                                            fontStyle: 'italic'
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
                            marginTop: '2%',
                            flexDirection: 'row',
                            justifyContent: 'space-between'
                        }}>
                            <Text></Text>
                            <Text style={{
                                fontFamily: 'Inconsolata-Bold',
                                // fontStyle: 'italic',
                                fontSize: 24,
                                color: '#424242',
                            }}>Total : {order.price_total} {currency}</Text>

                        </View>
                    </View>


                    {/* order detail */}
                    <List.Section >
                        {/* Client details */}
                        <List.Accordion
                            expanded={expandeds[0]}
                            onPress={() => handlePress(0)}
                            descriptionStyle={{ fontFamily: 'Montserrat-Regular', fontSize: 12 }}
                            title="Client details" description="Phone, E-mail" titleStyle={{ color: expandeds[0] ? "#df8f17" : "#7f7f7f", fontFamily: 'Montserrat-Regular' }}
                            left={props => <List.Icon {...props} icon="information" color={expandeds[0] ? "#df8f17" : "#7f7f7f"} />} rippleColor={"#df8f17"}
                            style={[
                                {
                                    ...(!expandeds[0] && { borderBottomColor: '#7f7f7f', borderBottomWidth: 1 }),
                                    backgroundColor: '#fafafa'
                                },
                            ]}>
                            <List.Item title={`Phone : ${order.client_phone}`} />
                            <List.Item title={`Email : ${order.client_email}`} />
                        </List.Accordion>

                        {/* Fulfillment */}
                        <List.Accordion
                            expanded={expandeds[1]}
                            onPress={() => handlePress(1)}
                            descriptionStyle={{ fontFamily: 'Montserrat-Regular', fontSize: 12 }}
                            title="Fulfillment" description="Mode, Reserved table, Source, Date and time, Address" titleStyle={{ color: expandeds[1] ? "#df8f17" : "#7f7f7f", fontFamily: 'Montserrat-Regular' }}
                            left={props => <List.Icon {...props} icon="information" color={expandeds[1] ? "#df8f17" : "#7f7f7f"} />} rippleColor={"#df8f17"}
                            style={[
                                {
                                    ...(!expandeds[1] && { borderBottomColor: '#7f7f7f', borderBottomWidth: 1 }),
                                    backgroundColor: '#fafafa'
                                },
                            ]}>
                            <List.Item title={`Mode : ${order.type}`} />
                            <List.Item title={`Reserved table : ${order.table}`} />
                            <List.Item title={`Source : ${order.source}`} />
                            <List.Item title={`Date and time : ${order.date} ${order.time}`} />
                            <List.Item title={`Address : ${order.deliveryAdress}`} />

                        </List.Accordion>
                        {/* Payment */}
                        <List.Accordion
                            expanded={expandeds[2]}
                            onPress={() => handlePress(2)}
                            descriptionStyle={{ fontFamily: 'Montserrat-Regular', fontSize: 12 }}
                            title="Payment" description="Status, Method" titleStyle={{ color: expandeds[2] ? "#df8f17" : "#7f7f7f", fontFamily: 'Montserrat-Regular' }}
                            left={props => <List.Icon {...props} icon="information" color={expandeds[2] ? "#df8f17" : "#7f7f7f"} />} rippleColor={"#df8f17"}
                            style={
                                {
                                    backgroundColor: '#fafafa'
                                }
                            }>
                            <List.Item title={`Status : `} />
                            <List.Item title={`Method : `} />
                        </List.Accordion>
                    </List.Section>

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
                                        console.log(order._id);
                                        console.log(err);
                                    })
                                }
                                updateOrderStatusToRejected()
                            }}
                                style={styles.rejectButton}>
                                <Text style={styles.textRejectButton}>Reject</Text>
                            </TouchableOpacity>
                        </View>
                    }
                    {toggleModal && (
                        <AcceptModal
                            modalProps={{
                                toggleModal,
                                setToggleModal,
                                stage,
                                index,
                                orderId: order._id
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
        marginRight: 5
    },
    textStatus: {
        color: 'white',
        fontFamily: 'Montserrat-Regular',
        fontSize: 12
    },
    textDateAndTime: {
        color: '#030303',
        fontFamily: 'Montserrat-Light',
        fontSize: 16
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