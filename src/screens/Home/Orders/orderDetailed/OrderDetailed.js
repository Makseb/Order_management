import { BackHandler, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { store } from "../../../../shared";
import { deleteOrderFromInProgressStage, updateState } from "../../../../shared/slices/Orders/OrdersSlice";
import { updateOrderStatus } from "../../../../shared/slices/Orders/OrdersService";
import { AcceptModal, RejectOrdersDetailedModal, Header } from "../../../../screens/exports";
import { ListSection } from "../../../../Components/exports";
import { useTranslation } from "react-i18next";

export default function OrderDetailed({ route }) {
    const { t: translation } = useTranslation();

    const [rejectModal, setRejectModal] = useState({
        state: false,
        data: {
            id: undefined,
            stage: undefined,
            action: undefined
        }
    })

    // get notification id from redux
    const notificationId = useSelector((state) => state.authentification.notificationId)

    let { id, stage } = route.params

    // get the order according to stage :"all" or "inprogress"
    const order =
        stage === "all"
            ? useSelector((state) => state.orders.all.find(order => order._id === id))
            : stage === "inprogress"
                ? useSelector((state) => state.orders.inprogress.find(order => order._id === id))
                : useSelector((state) => state.orders.ready.find(order => order._id === id));


    // open the detail of each title example (client details, fulfillment)
    const [expandeds, setExpandeds] = useState(null);

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
            for (let i = 0; i < 4; i++) {
                if (i == 0 || i == 1) {
                    data.push(true)
                } else {
                    data.push(false)
                }
            }
            setExpandeds(data);
        };
        initData();
    }, [])



    useEffect(() => {
        const handleBackPress = () => {
            // delete the order if status ready and stage inprogress
            if (order.status === "ready" && stage === "inprogress") {
                store.dispatch(deleteOrderFromInProgressStage({ id }))
            }
            return false;
        }
        // Listen to the back button press
        const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
        // Cleanup the event listener when the component unmounts
        return () => {
            backHandler.remove();
        }
    }, [order?.status]);



    return (
        <>
            {(order && expandeds != null) && <View style={styles.container}>
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
                            <Text style={[styles.orderIdText, { marginRight: '1%' }]}>{translation("Order ID")} : {order._id.substring(order._id.length - 4)}</Text>
                            <View style={[styles.tag, {
                                backgroundColor: (order.status === "accepted" || order.status === "ready") ? "#5cd964" : (order.status === "rejected") ? "#ff3b30" : (order.status === "missed") ? "#ff3b30" : "#fc0"
                            }]}>
                                <Text style={styles.textStatus}>
                                    {translation(order.status.charAt(0).toUpperCase() + order.status.slice(1))}
                                </Text>
                            </View>
                        </View>

                        {/* mapping products and show otther information of the order... */}
                        <ListSection listProps={{ order, expandeds, handlePress }} />

                        <View style={{ marginBottom: (order.status === "rejected" || order.status === "ready") && "3%" }} />

                        {/* Button reject and accept exist when order is pending */}
                        {
                            order.status === "pending" &&
                            <View style={styles.acceptRejectContainer}>
                                <TouchableOpacity style={styles.acceptButton} onPress={() => { setToggleModal(true) }}>
                                    <Text style={styles.textAcceptButton}>{translation("Accept")}</Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => {
                                    setRejectModal({
                                        state: true,
                                        data: {
                                            stage: "all",
                                            action: "rejected",
                                            id: order._id,
                                        }
                                    })
                                }}
                                    style={styles.rejectButton}>
                                    <Text style={styles.textRejectButton}>{translation("Reject")}</Text>
                                </TouchableOpacity>
                            </View>
                        }

                        {order.status === "accepted" && (
                            <View style={{
                                flexDirection: 'column', alignItems: 'center', marginVertical: '3%'
                            }}>
                                <TouchableOpacity style={styles.readyButton} onPress={() => {
                                    // update status in backend to ready
                                    const updateOrderStatusToReady = async () => {
                                        await updateOrderStatus({ status: "ready", _id: order._id }, notificationId).then(res => {
                                            store.dispatch(updateState({ id, action: "ready", stage: stage, updatedAt: res.order.updatedAt }))
                                        }).catch(err => {
                                            // Handle error
                                        })
                                    }
                                    updateOrderStatusToReady();
                                }}>
                                    <Text style={styles.textReadyButton}>Ready</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                        {/* show modal if toggleModal true */}
                        {toggleModal && (
                            <AcceptModal
                                modalProps={{
                                    toggleModal,
                                    setToggleModal,
                                    stage,
                                    id,
                                    orderId: order._id,
                                    preparedAt: order.preparedAt,
                                }}
                            />
                        )}
                        {/* show modal if rejectModal true */}
                        {rejectModal.state && <RejectOrdersDetailedModal modalProps={{ rejectModal, setRejectModal }} />}

                    </View>

                </ScrollView>

            </View>}


        </>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    orderIdText: {
        color: '#030303',
        fontFamily: 'Roboto-Light',
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
        fontFamily: 'Roboto-Regular',
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
    },
    readyButton: {
        height: 40,
        width: 150,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#5cd964',
        borderRadius: 24,
    },
    textReadyButton: {
        color: 'white',
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
    },

})