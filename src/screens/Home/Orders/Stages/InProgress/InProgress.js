import { View, TouchableWithoutFeedback, StyleSheet, ActivityIndicator, FlatList } from "react-native";

import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { Order } from "../../../../../Components/exports";
import { useEffect, useRef, useState } from "react";
import { BaseUrl, store } from "../../../../../shared";
import { setOrders } from "../../../../../shared/slices/Orders/OrdersSlice";
import { getAcceptedOrdersByStroreId } from "../../../../../shared/slices/Orders/OrdersService";
import EventSource from "react-native-sse";
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { FlashList } from "@shopify/flash-list";
import Sound from "react-native-sound";
import { useTranslation } from "react-i18next";

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
        isLoading: false,
        isLastPage: true,
        isNotification: false
    })

    // navigate between screens
    const navigation = useNavigation()

    // get the all orders in progress
    const orders = useSelector((state) => state.orders.inprogress)

    const { t: translation } = useTranslation();

    useEffect(() => {
        const eventSource = new EventSource(BaseUrl + "/sse/sse/" + storeSelected + "/" + notificationId);

        const handleEventMessage = (data) => {
            if (!data.data.toLowerCase().includes("welcome")) {
                const fetchAcceptedOrdersByStroreId = async () => {
                    if (data.data.includes("{")) {
                        flatListRef.current.scrollToOffset({ offset: 0 })
                        requestAnimationFrame(async () => {
                            await getAcceptedOrdersByStroreId(storeSelected, state.page + 1, false, true).then(res => {
                                store.dispatch(setOrders({ orders: res.orders, currency: currency, stage: "inprogress", firstUpdate: true }))
                                Toast.show({
                                    type: 'success',
                                    text1: translation("Order has been changed from another interface."),
                                });
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
                        })

                    } else if (data.data.includes("Your order is missed")) {
                        Toast.show({
                            type: 'error',
                            text1: translation("Order missed."),
                        });
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
                    } else {
                        Toast.show({
                            type: 'success',
                            text1: translation("Order received. 3 minutes and it will be missed."),
                        });
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
                    }
                }
                fetchAcceptedOrdersByStroreId()
            }
        }

        // Grab all events with the type of 'message'
        eventSource.addEventListener('message', (data) => {
            handleEventMessage(data)
        });

        const fetchAcceptedOrdersByStroreId = async () => {
            if (state.isNotification) {
                setState(prevState => ({
                    ...prevState,
                    isNotification: false
                }))
            } else if (state.page > 1) {
                setState(prevState => ({
                    ...prevState,
                    isLoading: true,
                }))
                await getAcceptedOrdersByStroreId(storeSelected, state.page, true, false).then(res => {
                    store.dispatch(setOrders({ orders: res.orders, currency: currency, stage: "inprogress" }))
                    setState(prevState => ({
                        ...prevState,
                        isLoading: false,
                        isLastPage: res.isLastPage,
                    }))
                }).catch(err => {
                })
            } else {
                await getAcceptedOrdersByStroreId(storeSelected, state.page, false, true).then(res => {
                    store.dispatch(setOrders({ orders: res.orders, currency: currency, stage: "inprogress", firstUpdate: true }))
                    setState(prevState => ({
                        ...prevState,
                        isLastPage: res.isLastPage
                    }))
                }).catch(err => {
                })
            }
        }
        fetchAcceptedOrdersByStroreId()

        return () => {
            // Log that the component is unmounting
            // console.log('Restaurant App is unmounting...');
            // Remove the event listener and close the connection
            // console.log('Removing event listener and closing EventSource connection...');
            eventSource.removeEventListener('message', handleEventMessage);
            eventSource.close();
        };

    }, [state.page]);


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
        <View style={{ flexGrow: 1, flexDirection: "row", minHeight: 100 }}>
            <FlashList
                estimatedItemSize={100}
                ref={flatListRef}
                initialScrollIndex={0}
                data={orders}
                renderItem={renderItem}
                keyExtractor={(item) => item._id.toString()}
                onEndReached={loadMoreItem}
                onEndReachedThreshold={0}
                ListFooterComponent={renderLoader}
                contentContainerStyle={{ paddingBottom: 200 }}
            />
        </View>
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