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

    // increment page when there are more pages
    const [page, setPage] = useState(1)

    // get boolean from api and set it to this hook
    const [isLastPage, setIsLastPage] = useState(true)

    // loader in bottom
    const [isLoading, setIsLoading] = useState(false)

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

                        await getAcceptedOrdersByStroreId(storeSelected, 1, false).then(res => {
                            store.dispatch(setOrders({ orders: res.orders, currency: currency, stage: "inprogress" }))
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
        // this function will get accepted orders that was related to the store choosen from login step
        const fetchAcceptedOrdersByStroreId = async () => {
            // console.log(storeSelected);
            if (page > 1) {
                setIsLoading(true)
                await getAcceptedOrdersByStroreId(storeSelected, page, true).then(res => {
                    store.dispatch(setOrders({ orders: res.orders, currency: currency, stage: "inprogress" }))
                    setIsLastPage(res.isLastPage)
                    setIsLoading(false)
                    setPageAfterLoading((prevPage) => prevPage + 1)
                }).catch(err => {
                })
            } else {
                if (isNotification) {
                    setIsNotification(false)
                } else {
                    await getAcceptedOrdersByStroreId(storeSelected, page, false).then(res => {
                        store.dispatch(setOrders({ orders: res.orders, currency: currency, stage: "inprogress" }))
                        setIsLastPage(res.isLastPage)
                    }).catch(err => {
                    })
                }
            }
        }
        fetchAcceptedOrdersByStroreId()
    }, [page])

    const showButtonViewAndReject = (id) => {
        navigation.navigate('OrderDetailed', { id, stage: "inprogress" })
    }
    // navigate between screens
    const navigation = useNavigation()

    // get the all orders in progress
    const orders = useSelector((state) => state.orders.inprogress)

    const loadMoreItem = () => {
        if (!isLastPage && page === pageAfterLoading) {
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
                data={orders}
                renderItem={renderItem}
                keyExtractor={item => item._id}
                onEndReached={loadMoreItem}
                onEndReachedThreshold={0}
                ListFooterComponent={renderLoader}
                style={{ marginBottom: '11.5%' }}
                ref={flatListRef}
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