import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { store } from "../../../../../shared";
import { getReadyOrdersByStroreId } from "../../../../../shared/slices/Orders/OrdersService";
import { setOrders } from "../../../../../shared/slices/Orders/OrdersSlice";
import { ActivityIndicator, FlatList, ScrollView, StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import { Order } from "../../../../../Components/exports";
import { useNavigation } from "@react-navigation/native";

export default function Ready() {
    // get store selected
    const storeSelected = useSelector((state) => state.authentification.storeSelected.store._id)

    // get currency
    const currency = useSelector((state) => state.authentification.storeSelected.currency)

    // get the all orders in progress
    const orders = useSelector((state) => state.orders.ready)

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

        // this function will get ready orders that was related to the store choosen from login step
        const fetchReadyOrdersByStroreId = async () => {
            if (page > 1) {
                setIsLoading(true)
                await getReadyOrdersByStroreId(storeSelected, page, true).then(res => {
                    store.dispatch(setOrders({ orders: res.orders, currency: currency, stage: "ready" }))
                    setIsLastPage(res.isLastPage)
                    setIsLoading(false)
                    setPageAfterLoading(pageAfterLoading + 1)
                }).catch(err => {
                })
            } else {
                await getReadyOrdersByStroreId(storeSelected, page, false).then(res => {
                    store.dispatch(setOrders({ orders: res.orders, currency: currency, stage: "ready" }))
                    setIsLastPage(res.isLastPage)
                }).catch(err => {
                })
            }
        }
        fetchReadyOrdersByStroreId()
    }, [page])

    const showButtonViewAndReject = (id) => {
        navigation.navigate('OrderDetailed', { id, stage: "ready" })
    }
    const navigation = useNavigation()



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
        <FlatList
            data={orders}
            renderItem={renderItem}
            keyExtractor={item => item._id}
            onEndReached={loadMoreItem}
            onEndReachedThreshold={0}
            ListFooterComponent={renderLoader}
            style={{ marginBottom: '11.5%' }}
        />
    )
}

const styles = StyleSheet.create({
    barSeparateOrder: {
        borderBottomColor: '#f0f0f0',
        borderBottomWidth: 3,
        marginHorizontal: '5%',
    }
})