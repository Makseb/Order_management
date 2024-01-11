import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TouchableWithoutFeedback, FlatList, ActivityIndicator } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";

import { setOrders } from "../../../../../shared/slices/Orders/OrdersSlice";
import { useSelector } from "react-redux";
import { Order } from "../../../../../Components/exports";
import { getAllOrdersByStroreId } from "../../../../../shared/slices/Orders/OrdersService";
import { BaseUrl, store } from "../../../../../shared";

import { RejectModal } from "./../../../../exports";
import EventSource from "react-native-sse";

import { Toast } from 'react-native-toast-message/lib/src/Toast';

export default function All() {

    // get store selected
    const storeSelected = useSelector((state) => state.authentification.storeSelected.store._id)

    // get currency
    const currency = useSelector((state) => state.authentification.storeSelected.currency)

    // get notification id
    const notificationId = useSelector((state) => state.authentification.notificationId)

    // navigate between screens
    const navigation = useNavigation()

    // loader in bottom
    const [isLoading, setIsLoading] = useState(false)

    // increment page when there are more pages
    const [page, setPage] = useState(1)

    // get boolean from api and set it to this hook
    const [isLastPage, setIsLastPage] = useState(true)

    // i use this to get page by page after loading
    const [pageAfterLoading, setPageAfterLoading] = useState(1)

    const [isNotification, setIsNotification] = useState(false)

    const flatListRef = useRef(null);

    useEffect(() => {

        const eventSource = new EventSource(BaseUrl + "/sse/sse/" + storeSelected + "/" + notificationId);

        const handleEventMessage = (data) => {
            if (!data.data.toLowerCase().includes("welcome")) {
                const fetchAllOrdersByStroreId = async () => {

                    flatListRef.current.scrollToOffset({ offset: 0 })

                    requestAnimationFrame(async () => {

                        await getAllOrdersByStroreId(storeSelected, 1, false).then(res => {
                            store.dispatch(setOrders({ orders: res.orders, currency: currency, stage: "all" }))
                            setIsNotification(true)
                            setPageAfterLoading(1)
                            setIsLastPage(res.isLastPage)
                            setPage(1)
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
            if (page > 1) {
                setIsLoading(true)
                await getAllOrdersByStroreId(storeSelected, page, true).then(res => {
                    store.dispatch(setOrders({ orders: res.orders, currency: currency, stage: "all" }))
                    setIsLastPage(res.isLastPage)
                    setPageAfterLoading((prevPage) => prevPage + 1)
                    setIsLoading(false)
                }).catch(err => {
                })
            } else {
                if (isNotification) {
                    setIsNotification(false)
                } else {
                    await getAllOrdersByStroreId(storeSelected, page, false).then(res => {
                        store.dispatch(setOrders({ orders: res.orders, currency: currency, stage: "all" }))
                        setIsLastPage(res.isLastPage)
                    }).catch(err => {
                    })
                }
            }
        }
        fetchAllOrdersByStroreId()
    }, [page])

    // get the orders from redux
    const orders = useSelector((state) => state.orders.all)

    // this function is used to show or not show buttons view and reject
    const [showButtons, setShowButtons] = useState([])
    const showButtonViewAndReject = (id, action) => {
        if (action === "pending") {
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
        console.log("wsel");
        if (!isLastPage && page === pageAfterLoading) {
            console.log("page :", page);
            console.log("afterloading :", pageAfterLoading)
            setPage((prevPage) => prevPage + 1)
        }
    };

    const renderLoader = () => {
        return (
            isLoading &&
            <View style={styles.loaderStyle}>
                <ActivityIndicator size="large" color="#7f7f7f" />
            </View>
        );
    };

    const renderItem = ({ item: order }) => {
        return <View key={order._id}>
            <TouchableWithoutFeedback onPress={() => showButtonViewAndReject(order._id, order.status)} >
                <View style={{ marginHorizontal: '5%' }}>

                    {/* mapping orders */}
                    <Order order={order} />
                    {/* showing button view and reject if status pending */}
                    {
                        showButtons.includes(order._id) && order.status === "pending" && (
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
                </View>
            </TouchableWithoutFeedback>
            {/* bar that separate orders */}
            < View style={styles.barSeparateOrder} />
        </View>
    }

    return (
        <>
            {toggleModal.state && <RejectModal modalProps={{ toggleModal, setToggleModal }} />}
            <FlatList
                ref={flatListRef}
                initialScrollIndex={0}
                data={orders}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                onEndReached={loadMoreItem}
                onEndReachedThreshold={0}
                ListFooterComponent={renderLoader}
                style={{ marginBottom: '11.5%' }}
            />
            <Toast />
        </>
    )
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