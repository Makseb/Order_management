import { View, ScrollView, TouchableWithoutFeedback, StyleSheet, ActivityIndicator, FlatList } from "react-native";

import { shallowEqual, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { Order } from "../../../../../Components/exports";
import { useEffect, useState } from "react";
import { store } from "../../../../../shared";
import { setOrders } from "../../../../../shared/slices/Orders/OrdersSlice";
import { getAcceptedOrdersByStroreId } from "../../../../../shared/slices/Orders/OrdersService";

export default function InProgress() {
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

    useEffect(() => {
        console.log("page :",page);
        // this function will get accepted orders that was related to the store choosen from login step
        const fetchAcceptedOrdersByStroreId = async () => {
            // console.log(storeSelected);
            if (page > 1) {
                setIsLoading(true)
                await getAcceptedOrdersByStroreId(storeSelected, page, true).then(res => {
                    store.dispatch(setOrders({ orders: res.orders, currency: currency, stage: "inprogress" }))
                    setIsLastPage(res.isLastPage)
                    setIsLoading(false)
                    setPageAfterLoading(pageAfterLoading + 1)
                }).catch(err => {
                })
            } else {
                await getAcceptedOrdersByStroreId(storeSelected, page, false).then(res => {
                    store.dispatch(setOrders({ orders: res.orders, currency: currency, stage: "inprogress" }))
                    setIsLastPage(res.isLastPage)
                }).catch(err => {
                })
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
            />
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