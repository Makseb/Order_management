import { View, TouchableWithoutFeedback, StyleSheet, ActivityIndicator, FlatList } from "react-native";

import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { Order } from "../../../../../Components/exports";
import { useEffect, useRef, useState } from "react";
import { BaseUrl, store } from "../../../../../shared";
import { setOrders, updateOneOrder } from "../../../../../shared/slices/Orders/OrdersSlice";
import { getAcceptedOrdersByStroreId } from "../../../../../shared/slices/Orders/OrdersService";
import EventSource from "react-native-sse";
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { FlashList } from "@shopify/flash-list";
import Sound from "react-native-sound";
import { useTranslation } from "react-i18next";
import { setUberCreate, setUberToken } from "../../../../../shared/slices/Delivery/DeliverySlice";
import { createdelivery, getUberToken } from "../../../../../shared/slices/Delivery/DeliveryService";

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

    const organizations = useSelector((state) => state.delivery.organizations)
    const indexOfCheckedOrganization = organizations.findIndex((org) =>
        org.options.some((option) => option.checked)
    );

    // get store storeInfos
    const storeInfos = useSelector((state) => state.authentification.storeSelected.store)


    useEffect(() => {
        const eventSource = new EventSource(BaseUrl + "/sse/sse/" + storeSelected + "/" + notificationId);

        const handleEventMessage = (data) => {
            if (!data.data.toLowerCase().includes("welcome")) {
                const fetchAcceptedOrdersByStroreId = async () => {
                    if (data.data[0] === "{") {
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
                        const order = JSON.parse(data.data.substring(1))
                        if (organizations[indexOfCheckedOrganization].name === "Uber direct" && order.type === "Delivery") {
                            // console.log(organizations[indexOfCheckedOrganization].options);
                            let isAutomaticDelivery = false;
                            for (let i = 0; i < organizations[indexOfCheckedOrganization].options.length; i++) {
                                if (organizations[indexOfCheckedOrganization].options[i].name === "Automatic" &&
                                    organizations[indexOfCheckedOrganization].options[i].checked === true) {
                                    isAutomaticDelivery = true;
                                }
                            }
                            if (isAutomaticDelivery) {
                                const adddelivery = async () => {
                                    try {
                                        let productArray = []
                                        for (let i = 0; i < order.items.length; i++) {
                                            const obj = { must_be_upright: true, size: order.items[i].size === "S" ? "small" : order.items[i].size === "M" ? "medium" : "large" }
                                            obj.name = order.items[i].name
                                            obj.quantity = order.items[i].quantity
                                            productArray.push(obj)
                                        }
                                        for (let i = 0; i < order.promo.length; i++) {
                                            for (let j = 0; j < order.promo[i].items.length; j++) {
                                                const obj = { must_be_upright: true, size: order.promo[i].items[j].size === "S" ? "small" : order.promo[i].items[j].size === "M" ? "medium" : "large" }
                                                obj.name = order.promo[i].items[j].name
                                                obj.quantity = order.promo[i].items[j].quantity
                                                productArray.push(obj)
                                            }
                                        }
                                        const token = await getUberToken()
                                        store.dispatch(setUberToken({ ubertoken: token.accessToken }))

                                        const deliveryData = {
                                            external_store_id: order.storeId,
                                            pickup_name: storeInfos.name,
                                            pickup_address: order.restaurantAdress,
                                            pickup_phone_number: storeInfos.phoneNumber,
                                            dropoff_name: order.client_first_name + " " + order.client_last_name,
                                            dropoff_address: order.deliveryAdress,
                                            dropoff_phone_number: order.client_phone,
                                            manifest_items: productArray,
                                            test_specifications: {
                                                robo_courier_specification: {
                                                    mode: "auto",
                                                }
                                            },
                                            signature_requirement: {
                                                enabled: true,
                                                collect_signer_name: true,
                                                collect_signer_relationship: false
                                            }
                                        };

                                        const deliveryResponse = await createdelivery(deliveryData, token.accessToken, order._id)
                                        console.log("inprogress deliveryResponse",deliveryResponse);
                                        store.dispatch(updateOneOrder({ order: deliveryResponse.updatedOrder }))
                                        store.dispatch(setUberCreate({ create: deliveryResponse.uberDelivery }))
                                    } catch (error) {
                                    }
                                }
                                adddelivery()
                            }
                        }
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

    }, [state.page,organizations]);


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