import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TouchableWithoutFeedback, FlatList, ActivityIndicator, Dimensions } from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";

import { setOrders } from "../../../../../shared/slices/Orders/OrdersSlice";
import { useSelector } from "react-redux";
import { Order } from "../../../../../Components/exports";
import { getAllOrdersByStroreId } from "../../../../../shared/slices/Orders/OrdersService";
import { BaseUrl, store } from "../../../../../shared";

import { RejectModal } from "./../../../../exports";
import EventSource from "react-native-sse";

import { Toast } from 'react-native-toast-message/lib/src/Toast';
import Sound from 'react-native-sound';
import { FlashList } from "@shopify/flash-list";

export default function All() {

    // get store selected
    const storeSelected = useSelector((state) => state.authentification.storeSelected.store._id)

    // get currency
    const currency = useSelector((state) => state.authentification.storeSelected.currency)

    // get notification id
    const notificationId = useSelector((state) => state.authentification.notificationId)

    // navigate between screens
    const navigation = useNavigation()

    const [state, setState] = useState({
        page: 1,
        isLoading: false,
        isLastPage: true,
        isNotification: false
    })

    const flatListRef = useRef(null);

    // get the orders from redux
    const orders = useSelector((state) => state.orders.all)

    useEffect(() => {

        const eventSource = new EventSource(BaseUrl + "/sse/sse/" + storeSelected + "/" + notificationId);

        const handleEventMessage = (data) => {
            if (!data.data.toLowerCase().includes("welcome")) {
                const fetchAllOrdersByStroreId = async () => {

                    flatListRef.current.scrollToOffset({ offset: 0 })

                    requestAnimationFrame(async () => {

                        await getAllOrdersByStroreId(storeSelected, 1, false).then(res => {
                            store.dispatch(setOrders({ orders: res.orders, currency: currency, stage: "all", firstUpdate: true }))
                            setState(prevState => ({
                                ...prevState,
                                page: 1,
                                isLastPage: res.isLastPage,
                                isNotification: true
                            }))

                            if (data.data.includes("{")) {
                                Toast.show({
                                    type: 'success',
                                    text1: "Order has been changed from another interface.",
                                });
                            } else if (data.data.includes("Your order is missed")) {
                                Toast.show({
                                    type: 'error',
                                    text1: "The order is missed.",
                                });
                            } else {
                                Toast.show({
                                    type: 'success',
                                    text1: "Order received. 3 minutes and it will be missed.",
                                });
                            }
                            var whoosh = new Sound('ring.mp3', Sound.MAIN_BUNDLE, (error) => {
                                if (error) {
                                    return;
                                }
                                whoosh.play((success) => {
                                    if (success) {
                                    } else {
                                    }
                                });
                            });
                        }).catch(err => {
                            console.log(err);
                        })
                    });
                }
                fetchAllOrdersByStroreId()
            }
        }

        // Grab all events with the type of 'message'
        eventSource.addEventListener('message', (data) => {
            handleEventMessage(data)
        });

        return () => {
            // Log that the component is unmounting
            console.log('Restaurant App is unmounting...');
            // Remove the event listener and close the connection
            console.log('Removing event listener and closing EventSource connection...');
            eventSource.removeEventListener('message', handleEventMessage);
            eventSource.close();
        };

    }, []);


    useEffect(() => {
        // this function will get the all orders that was related to the store choosen from login step
        const fetchAllOrdersByStroreId = async () => {
            if (state.page > 1) {
                setState(prevState => ({
                    ...prevState,
                    isLoading: true,
                }))

                await getAllOrdersByStroreId(storeSelected, state.page, true).then(res => {
                    store.dispatch(setOrders({ orders: res.orders, currency: currency, stage: "all" }))
                    setState(prevState => ({
                        ...prevState,
                        isLoading: false,
                        isLastPage: res.isLastPage,
                    }))
                }).catch(err => {
                })
            } else {
                if (state.isNotification) {
                    setState(prevState => ({
                        ...prevState,
                        isNotification: false
                    }))
                } else {
                    await getAllOrdersByStroreId(storeSelected, state.page, false).then(res => {
                        store.dispatch(setOrders({ orders: res.orders, currency: currency, stage: "all", firstUpdate: true }))
                        setState(prevState => ({
                            ...prevState,
                            isLastPage: res.isLastPage
                        }))
                    }).catch(err => {
                    })
                }
            }
        }
        fetchAllOrdersByStroreId()
    }, [state.page])


    // this function is used to show or not show buttons view and reject
    const [showButtons, setShowButtons] = useState([])
    const showButtonViewAndReject = (id, action) => {
        if (action === "pending") {
            console.log(action)
            setShowButtons((prevShowButtons) => {
                if (!prevShowButtons.includes(id)) {
                    return [...prevShowButtons, id];
                } else {
                    return prevShowButtons.filter((item) => item !== id);
                }
            })
        } else {
            navigation.navigate('OrderDetailed', { id, stage: "all" })
        }
    }

    console.log(showButtons);

    // change state of order by rejecting or view to the order detailed
    const changeState = (action, id, event) => {
        event.stopPropagation()
        if (action === "view") {
            navigation.navigate('OrderDetailed', { id, stage: "all" })
        }
    }

    const [toggleModal, setToggleModal] = useState({
        state: false,
        data: {
            id: undefined,
            stage: undefined,
            action: undefined
        }
    })

    const loadMoreItem = () => {
        // console.log("wsel");
        if (!state.isLastPage && state.isLoading === false) {
            console.log("page :", state.page);
            console.log("---------------------------");
            setState(prevState => ({
                ...prevState,
                page: prevState.page + 1
            }))

        }
    };

    const renderLoader = () => {
        return (
            state.isLoading ?
                <View style={styles.loaderStyle}>
                    <ActivityIndicator size="large" color="#7f7f7f" />
                </View> : null
        );
    };

    const test = (order) => {
        console.log("tesssssssssssst");
        return showButtons.includes(order._id) && order.status === "pending" && (
            <View style={{
                alignSelf: 'center',
                flexDirection: 'row',
            }}>
                <TouchableOpacity onPress={(event) => { changeState("view", order._id, event) }} style={styles.viewButton}>
                    <Text style={styles.textViewButton}>View</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    setToggleModal({
                        state: true,
                        data: {
                            stage: "all",
                            action: "rejected",
                            id: order._id,
                        }
                    })
                }} style={styles.rejectButton}>
                    <Text style={styles.textRejectButton}>Reject</Text>
                </TouchableOpacity>
            </View>
        )
    }

    const renderItem = ({ item: order }) => (
        <View key={order._id}>
            <TouchableWithoutFeedback onPress={() => showButtonViewAndReject(order._id, order.status)}>
                <View style={{ marginHorizontal: '5%' }}>
                    {/* mapping orders */}
                    <Order order={order} />
                    {/* showing button view and reject if status pending */}
                    {/* {showButtons.includes(order._id) && order.status === "pending" && (
                        <View style={{
                            alignSelf: 'center',
                            flexDirection: 'row',
                        }}>
                            <TouchableOpacity onPress={(event) => { changeState("view", order._id, event) }} style={styles.viewButton}>
                                <Text style={styles.textViewButton}>View</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                setToggleModal({
                                    state: true,
                                    data: {
                                        stage: "all",
                                        action: "rejected",
                                        id: order._id,
                                    }
                                })
                            }} style={styles.rejectButton}>
                                <Text style={styles.textRejectButton}>Reject</Text>
                            </TouchableOpacity>
                        </View>
                    )} */}
                    {test(order)}
                </View>
            </TouchableWithoutFeedback>

            {/* bar that separates orders */}
            <View style={styles.barSeparateOrder} />
        </View>
    )

    return (
        <>
            <View style={{ flexGrow: 1, flexDirection: "row", minHeight: 2 }}>
                <FlashList
                    estimatedItemSize={400}
                    ref={flatListRef}
                    initialScrollIndex={0}
                    data={orders}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    onEndReached={loadMoreItem}
                    onEndReachedThreshold={0}
                    ListFooterComponent={renderLoader}
                    contentContainerStyle={{ paddingBottom: 200 }}
                />
            </View>


            <Toast />
            {toggleModal.state && <RejectModal modalProps={{ toggleModal, setToggleModal }} />}


        </>
    );
}

const styles = StyleSheet.create({
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

        marginBottom: '1%'
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
    },
    loaderStyle: {
        marginVertical: 5,
        flexDirection: 'row',
        justifyContent: 'center'
    },
})