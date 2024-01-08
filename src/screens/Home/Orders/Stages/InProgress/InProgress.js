import { View, ScrollView, TouchableWithoutFeedback, StyleSheet } from "react-native";

import { shallowEqual, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { Order } from "../../../../../Components/exports";
import { useEffect } from "react";
import { store } from "../../../../../shared";
import { setOrders } from "../../../../../shared/slices/Orders/OrdersSlice";
import { getAcceptedOrdersByStroreId } from "../../../../../shared/slices/Orders/OrdersService";

export default function InProgress() {
    // get store selected
    const storeSelected = useSelector((state) => state.authentification.storeSelected.store._id)

    // get currency
    const currency = useSelector((state) => state.authentification.storeSelected.currency)

    useEffect(() => {
        // this function will get accepted orders that was related to the store choosen from login step
        const fetchAcceptedOrdersByStroreId = async () => {
            // console.log(storeSelected);
            await getAcceptedOrdersByStroreId(storeSelected).then(res => {
                store.dispatch(setOrders({ orders: res.orders, currency: currency, stage: "inprogress" }))
                
            }).catch(err => {
            })
        }
        fetchAcceptedOrdersByStroreId()
    }, [])

    const showButtonViewAndReject = (id) => {
        navigation.navigate('OrderDetailed', { id, stage: "inprogress" })
    }
    // navigate between screens
    const navigation = useNavigation()

    // get the all orders in progress
    const orders = useSelector((state) => state.orders.inprogress)

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

    );
}
const styles = StyleSheet.create({
    barSeparateOrder: {
        borderBottomColor: '#f0f0f0',
        borderBottomWidth: 3,
        marginHorizontal: '5%',
    }
})