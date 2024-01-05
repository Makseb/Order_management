import { useEffect } from "react";
import { useSelector } from "react-redux";
import { store } from "../../../../../shared";
import { getReadyOrdersByStroreId } from "../../../../../shared/slices/Orders/OrdersService";
import { setOrders } from "../../../../../shared/slices/Orders/OrdersSlice";
import { ScrollView, StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import { Order } from "../../../../../Components/exports";
import { useNavigation } from "@react-navigation/native";

export default function Ready() {
    // get store selected
    const storeSelected = useSelector((state) => state.authentification.storeSelected._id)

    // get currency
    const currency = useSelector((state) => state.authentification.storeSelected.currency)

    // get the all orders in progress
    const orders = useSelector((state) => state.orders.ready)

    useEffect(() => {
        // this function will get ready orders that was related to the store choosen from login step
        const fetchReadyOrdersByStroreId = async () => {
            await getReadyOrdersByStroreId(storeSelected).then(res => {
                store.dispatch(setOrders({ orders: res.orders, currency: currency, stage: "ready" }))
            }).catch(err => {
            })
        }
        fetchReadyOrdersByStroreId()
    }, [])

    const showButtonViewAndReject = (id) => {
        navigation.navigate('OrderDetailed', { id, stage: "ready" })
    }
    const navigation = useNavigation()
    return (
        <ScrollView>
            {
                orders.map((order, index) => {
                    return (<View key={order._id}>
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
                })
            }
        </ScrollView >
    )
}

const styles = StyleSheet.create({
    barSeparateOrder: {
        borderBottomColor: '#f0f0f0',
        borderBottomWidth: 3,
        marginHorizontal: '5%',
    }
})