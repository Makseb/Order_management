import { View, ScrollView, TouchableWithoutFeedback, StyleSheet, ActivityIndicator, FlatList } from "react-native";

import { shallowEqual, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { Order } from "../../../../../Components/exports";
import { useEffect, useRef, useState } from "react";
import { BaseUrl, store } from "../../../../../shared";
import { setOrders } from "../../../../../shared/slices/Orders/OrdersSlice";
import { getAcceptedOrdersByStroreId } from "../../../../../shared/slices/Orders/OrdersService";
import EventSource from "react-native-sse";
import { Toast } from 'react-native-toast-message/lib/src/Toast';

export default function InProgress() {
    // get notification id
    const notificationId = useSelector((state) => state.authentification.notificationId)

    // get store selected
    const storeSelected = useSelector((state) => state.authentification.storeSelected.store._id)

    // get currency
    const currency = useSelector((state) => state.authentification.storeSelected.currency)

    const flatListRef = useRef(null)

    const [state, setState] = useState({
        page: 1,
        isLastPage: true,
        isLoading: false,
        isNotification: false
    })

    // navigate between screens
    const navigation = useNavigation()

    // get the all orders in progress
    const orders = useSelector((state) => state.orders.inprogress)

    useEffect(() => {

        const eventSource = new EventSource(BaseUrl + "/sse/sse/" + storeSelected + "/" + notificationId);

        const handleEventMessage = (data) => {
            if (!data.data.toLowerCase().includes("welcome")) {
                const fetchAllOrdersByStroreId = async () => {

                    flatListRef.current.scrollToOffset({ offset: 0 })

                    requestAnimationFrame(async () => {
                        await getAcceptedOrdersByStroreId(storeSelected, 1, false).then(res => {
                            store.dispatch(setOrders({ orders: res.orders, currency: currency, stage: "inprogress", firstUpdate: true }))
                            setState(prevState => ({
                                ...prevState,
                                page: 1,
                                isLastPage: res.isLastPage,
                                isNotification: true,
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
        // this function will get accepted orders that was related to the store choosen from login step
        const fetchAcceptedOrdersByStroreId = async () => {
            // console.log(storeSelected);
            if (state.page > 1) {
                setState(prevState => ({
                    ...prevState,
                    isLoading: true,
                }))
                await getAcceptedOrdersByStroreId(storeSelected, state.page, true).then(res => {
                    store.dispatch(setOrders({ orders: res.orders, currency: currency, stage: "inprogress" }))
                    setState(prevState => ({
                        ...prevState,
                        isLastPage: res.isLastPage,
                        isLoading: false,
                    }))
                }).catch(err => {
                })
            } else {
                if (state.isNotification === true) {
                    setState(prevState => ({
                        ...prevState,
                        isNotification: false
                    }))
                } else {
                    await getAcceptedOrdersByStroreId(storeSelected, state.page, false).then(res => {
                        store.dispatch(setOrders({ orders: res.orders, currency: currency, stage: "inprogress", firstUpdate: true }))
                        setState(prevState => ({
                            ...prevState,
                            isLastPage: res.isLastPage
                        }))
                    }).catch(err => {
                    })
                }
            }
        }
        fetchAcceptedOrdersByStroreId()
    }, [state.page])

    const showButtonViewAndReject = (id) => {
        navigation.navigate('OrderDetailed', { id, stage: "inprogress" })
    }

    const loadMoreItem = () => {
        if (!state.isLastPage && !state.isLoading) {
            setState(prevState => ({
                ...prevState,
                page: prevState.page + 1
            }))
        }
    };

    const renderLoader = () => {
        return (
            state.isLoading &&
            <View style={styles.loaderStyle}>
                <ActivityIndicator size="large" color="#7f7f7f" />
            </View>
        );
    };

    const renderItem = ({ item: order }) => {
        return (
            <View key={order._id}>
                <TouchableWithoutFeedback onPress={() => showButtonViewAndReject(order._id)} >
                    <View style={{ marginHorizontal: '5%' }}>
                        {/* mapping orders */}
                        <Order order={order} />
                    </View>
                </TouchableWithoutFeedback>
                {/* bar that separate orders */}
                < View style={styles.barSeparateOrder} />
            </View>
        )
    }

    return (
        <>
            <FlatList
                removeClippedSubviews={true}
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