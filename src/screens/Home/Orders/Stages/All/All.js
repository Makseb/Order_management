import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TouchableWithoutFeedback, FlatList, ActivityIndicator, Dimensions } from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";

import { setOrders, updateOneOrder } from "../../../../../shared/slices/Orders/OrdersSlice";
import { useSelector } from "react-redux";
import { Order } from "../../../../../Components/exports";
import { getAllOrdersByStroreId } from "../../../../../shared/slices/Orders/OrdersService";
import { BaseUrl, store } from "../../../../../shared";

import { RejectModal } from "./../../../../exports";
import EventSource from "react-native-sse";

import { Toast } from 'react-native-toast-message/lib/src/Toast';
import Sound from 'react-native-sound';
import { FlashList } from "@shopify/flash-list";
import { useTranslation } from "react-i18next";
import CryptoJS from 'react-native-crypto-js';
import { setUberCreate, setUberQuote, setUberToken } from "../../../../../shared/slices/Delivery/DeliverySlice";
import { createdelivery, createuberdevis, getUberToken } from "../../../../../shared/slices/Delivery/DeliveryService";

export default function All() {
    const { t: translation } = useTranslation();

    // get store selected
    const storeSelected = useSelector((state) => state.authentification.storeSelected.store._id)

    // get store storeInfos
    const storeInfos = useSelector((state) => state.authentification.storeSelected.store)

    // get currency
    const currency = useSelector((state) => state.authentification.storeSelected.currency)

    // get notification id
    const notificationId = useSelector((state) => state.authentification.notificationId)

    // navigate between screens
    const navigation = useNavigation()


    const organizations = useSelector((state) => state.delivery.organizations)
    const indexOfCheckedOrganization = organizations.findIndex((org) =>
        org.options.some((option) => option.checked)
    );
    // console.log("organizations : ", organizations[indexOfCheckedOrganization]);


    const [state, setState] = useState({
        page: 1,
        isLoading: false,
        isLastPage: true,
        isNotification: false
    })

    const flatListRef = useRef(null);

    // get the orders from redux
    const orders = useSelector((state) => state.orders.all)
    // console.log(orders);

    useEffect(() => {
        const eventSource = new EventSource(BaseUrl + "/sse/sse/" + storeSelected + "/" + notificationId);

        const handleEventMessage = (data) => {
            if (!data.data.toLowerCase().includes("welcome")) {
                const fetchAllOrdersByStroreId = async () => {
                    // console.log("data 1:", data.data);
                    if (data.data[0] === "{") {
                        flatListRef.current.scrollToOffset({ offset: 0 })
                        requestAnimationFrame(async () => {
                            await getAllOrdersByStroreId(storeSelected, state.page, false, true).then(res => {
                                store.dispatch(setOrders({ orders: res.orders, currency: currency, stage: "all", firstUpdate: true }))
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

                        // console.log("missed :", state.page)

                        flatListRef.current.scrollToOffset({ offset: 0 })
                        requestAnimationFrame(async () => {
                            await getAllOrdersByStroreId(storeSelected, state.page, false, true).then(res => {
                                store.dispatch(setOrders({ orders: res.orders, currency: currency, stage: "all", firstUpdate: true }))
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
                            }).catch(err => {
                                console.log(err);
                            })
                        })

                    } else {
                        flatListRef.current.scrollToOffset({ offset: 0 })
                        requestAnimationFrame(async () => {
                            await getAllOrdersByStroreId(storeSelected, state.page + 1, false, true).then(res => {
                                store.dispatch(setOrders({ orders: res.orders, currency: currency, stage: "all", firstUpdate: true }))
                                setState(prevState => ({
                                    ...prevState,
                                    page: prevState.page + 1,
                                    isLastPage: res.isLastPage,
                                    isNotification: true
                                }))
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
                            }).catch(err => {
                                console.log(err);
                            })
                        }) 
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
                                        console.log("all deliveryResponse",deliveryResponse);
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
                fetchAllOrdersByStroreId()
            }
        }

        // Grab all events with the type of 'message'
        eventSource.addEventListener('message', (data) => {
            handleEventMessage(data)
        });

        const fetchAllOrdersByStroreId = async () => {
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
                await getAllOrdersByStroreId(storeSelected, state.page, true, false).then(res => {
                    store.dispatch(setOrders({ orders: res.orders, currency: currency, stage: "all" }))
                    setState(prevState => ({
                        ...prevState,
                        isLoading: false,
                        isLastPage: res.isLastPage,
                    }))
                }).catch(err => {
                })
            } else {
                await getAllOrdersByStroreId(storeSelected, state.page, false, true).then(res => {
                    store.dispatch(setOrders({ orders: res.orders, currency: currency, stage: "all", firstUpdate: true }))
                    setState(prevState => ({
                        ...prevState,
                        isLastPage: res.isLastPage
                    }))
                }).catch(err => {
                })
            }
        }
        fetchAllOrdersByStroreId()

        return () => {
            // Log that the component is unmounting
            // console.log('Restaurant App is unmounting...');
            // Remove the event listener and close the connection
            // console.log('Removing event listener and closing EventSource connection...');
            eventSource.removeEventListener('message', handleEventMessage);
            eventSource.close();
        };

        // i add organization as dependency in useEffect cauz if the user in 'all' screen and go to setting nd change the organization or
        // option in organization, in that changes the useEffect will work another time nd redefine the new options of organization directly ...
    }, [state.page, organizations]);



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

        if (!state.isLastPage && state.isLoading === false) {
            // console.log("page : ",state.page);
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

    const renderItem = ({ item: order }) => (
        <View key={order._id}>
            <TouchableWithoutFeedback onPress={() => showButtonViewAndReject(order._id, order.status)}>
                <View style={{ marginHorizontal: '5%' }}>
                    {/* mapping orders */}
                    <Order order={order} />
                    {/* showing button view and reject if status pending */}
                    {showButtons.includes(order._id) && order.status === "pending" && (
                        <View style={{
                            alignSelf: 'center',
                            flexDirection: 'row',
                        }}>
                            <TouchableOpacity onPress={(event) => { changeState("view", order._id, event) }} style={styles.viewButton}>
                                <Text style={styles.textViewButton}>{translation("View")}</Text>
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
                                <Text style={styles.textRejectButton}>{translation("Reject")}</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </TouchableWithoutFeedback >

            {/* bar that separates orders */}
            <View style={styles.barSeparateOrder} />
        </View>
    )

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
                extraData={showButtons}
            />
            {toggleModal.state && <RejectModal modalProps={{ toggleModal, setToggleModal }} />}
        </View>
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