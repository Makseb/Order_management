
import { useSelector } from "react-redux";
import { List } from 'react-native-paper';
import { Badge } from 'react-native-elements'

import { updateOneOrder } from "../../../../shared/slices/Orders/OrdersSlice";
import { format } from "date-fns";

import { WayPointModal } from "./../../../exports"
import { createdelivery, createuberdevis, deletedeliverybyid, getUberToken, getdeliverybyid } from "../../../../shared/slices/Delivery/DeliveryService";
import { resetWebhook, setUberCreate, setUberQuote, setUberToken, setWebhook } from "../../../../shared/slices/Delivery/DeliverySlice";
import { useEffect, useState, } from "react"
import { View, Text, TouchableOpacity, ScrollView } from "react-native"
import { store } from "../../../../shared";
import Toast from "react-native-toast-message";
import useSocket from "../../../../shared/socket";

export default function UberDelivery({ toggleModal }) {
    const storeSelected = useSelector((state) => state.authentification.storeSelected.store)
    const uberResponse = useSelector((state) => state.delivery.uber)

    let order = useSelector((state) => state.orders.all).find((order) => order._id === toggleModal.orderId)
    if (!order) {
        order = useSelector((state) => state.orders.inprogress).find((order) => order._id === toggleModal.orderId)
        if (!order) {
            order = useSelector((state) => state.orders.ready).find((order) => order._id === toggleModal.orderId)
        }
    }
    const { joinRoom, listenSocket } = useSocket()

    useEffect(() => {
        const fetchuber = async () => {
            await getUberToken().then(res => {
                store.dispatch(setUberToken({ ubertoken: res.accessToken }))
                if (order.uberId !== null) {
                    joinRoom(order.uberId)

                    const fetchcreate = async () => {
                        await getdeliverybyid(order.uberId, res.accessToken).then(resp => {
                            store.dispatch(setUberCreate({ create: resp.uberDelivery }))
                        }).catch(err => {
                            console.log("err.message", err.message);
                        })
                    }
                    fetchcreate()
                }
            }).catch(err => {
                console.log("err.message", err.message);
            })
        }
        listenSocket()
        fetchuber()
    }, [])

    const [expandeds, setExpandeds] = useState([true, true, true, true])

    function formatDate(date) {
        return `${format(new Date(date), 'yyyy-MM-dd')} ${format(new Date(date), 'HH:mm')}`
    }
    const [wayPointModal, setWayPointModal] = useState({
        state: false,
        data: undefined
    })

    return (
        <ScrollView style={{ marginBottom: "20%", marginHorizontal: "5%" }}>

            {wayPointModal.state && <WayPointModal modalProps={{ wayPointModal, setWayPointModal }} />}

            <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: "5%" }}>


                {uberResponse.quote === undefined && uberResponse.create === undefined && order.uberId === null && <TouchableOpacity
                    style={{ borderRadius: 10, backgroundColor: "gray", flexDirection: "row", justifyContent: "center", alignItems: "center", width: 170, height: 40 }}
                    onPress={() => {
                        const adduberdevis = async (data, ubertoken) => {
                            await createuberdevis(data, ubertoken).then(resp => {
                                store.dispatch(setUberQuote({ quote: resp.uberDirectData }));
                            }).catch(err => {
                                console.log(err);
                                Toast.show({
                                    type: 'error',
                                    text1: err.response.data.message,
                                })
                            });
                        };
                        adduberdevis(order, uberResponse.token);
                    }}>
                    <Text style={{ fontSize: 17, padding: "1.5%", color: "white", fontFamily: "Roboto-Bold", }}>Search for delivery</Text>
                </TouchableOpacity>}


                {uberResponse.quote !== undefined && uberResponse.create === undefined && <TouchableOpacity
                    style={{ borderRadius: 10, backgroundColor: "gray", flexDirection: "row", justifyContent: "center", alignItems: "center", width: 170, height: 40 }}
                    onPress={() => {
                        const adddelivery = async () => {
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
                            await createdelivery({
                                external_store_id: order.storeId,
                                quote_id: uberResponse.quote.id,
                                pickup_name: storeSelected.name,
                                pickup_address: order.restaurantAdress,
                                pickup_phone_number: storeSelected.phoneNumber,
                                dropoff_name: order.name,
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
                            }, uberResponse.token, order._id).then(res => {
                                store.dispatch(updateOneOrder({ order: res.updatedOrder }))
                                store.dispatch(setUberCreate({ create: res.uberDelivery }))
                                joinRoom(res.updatedOrder.uberId)
                                listenSocket()

                            }).catch(err => {
                                console.log(err);
                            })
                        }
                        adddelivery()
                    }}><Text style={{ fontSize: 17, padding: "1.5%", color: "white", fontFamily: "Roboto-Bold", }}>Create delivery</Text>
                </TouchableOpacity>}


                {uberResponse.create !== undefined && uberResponse.create.complete === false && <TouchableOpacity
                    style={{ borderRadius: 10, backgroundColor: "gray", flexDirection: "row", justifyContent: "center", alignItems: "center", width: 170, height: 40 }}
                    onPress={async () => {
                        store.dispatch(resetWebhook({ uberId: order.uberId }))
                        await getdeliverybyid(uberResponse.create.id, uberResponse.token).then(res => {
                            store.dispatch(setUberCreate({ create: res.uberDelivery }))
                        }).catch(err => {
                            console.log(err.message);
                        })
                    }}>
                    <Text style={{ fontSize: 17, padding: "1.5%", color: "white", fontFamily: "Roboto-Bold", }}>Refresh</Text>
                    {uberResponse.webhook.find((webhook) => webhook.uberId === order.uberId) !== undefined && uberResponse.webhook.find((webhook) => webhook.uberId === order.uberId)?.counter !== 0 &&
                        <Badge containerStyle={{ position: "absolute", top: -4, right: -4 }} value={uberResponse.webhook.find((webhook) => webhook.uberId === order.uberId)?.counter} status="error" />
                    }
                </TouchableOpacity>}

                {uberResponse.create !== undefined && uberResponse.create.complete === false && <TouchableOpacity

                    style={{ marginLeft: "2%", borderRadius: 10, backgroundColor: "gray", flexDirection: "row", justifyContent: "center", alignItems: "center", width: 170, height: 40 }}
                    onPress={async () => {
                        await deletedeliverybyid(uberResponse.create.id, uberResponse.token, order?._id).then(res => {
                            store.dispatch(updateOneOrder({ order: res.updatedOrder }))
                            store.dispatch(resetUber())
                        }).catch(err => {
                            console.log(err.message);
                        })
                    }}>
                    <Text style={{ fontSize: 17, padding: "1.5%", color: "white", fontFamily: "Roboto-Bold", }}>Cancel</Text>
                </TouchableOpacity>}


                {uberResponse.create?.complete === true && <TouchableOpacity style={{ position: "relative", borderRadius: 10, backgroundColor: "gray", flexDirection: "row", justifyContent: "center", alignItems: "center", width: 170, height: 40 }} onPress={() => {
                    setWayPointModal({
                        state: true,
                        data: { uberId: uberResponse.create.id, token: uberResponse.token }
                    })
                }}>

                    <Text style={{ fontSize: 17, padding: "1.5%", color: "white", fontFamily: "Roboto-Bold", }}>Proof</Text>

                </TouchableOpacity>}

            </View>

            {uberResponse.quote !== undefined && uberResponse.create === undefined && <List.Section style={{ marginTop: "5%" }}>
                <List.Accordion
                    expanded={expandeds[0]}
                    onPress={() => setExpandeds([!expandeds[0], expandeds[1]])}
                    descriptionStyle={{ fontFamily: 'Roboto-Light', fontSize: 12 }}
                    title="Restaurant informations(Pickup)" titleStyle={{ color: expandeds[0] ? "#5cd964" : "#7f7f7f", fontFamily: 'Robot-Regular' }}
                    left={props => <List.Icon {...props} icon="information" color={expandeds[0] ? "#5cd964" : "#7f7f7f"} />} rippleColor={"#5cd964"}
                    style={[{ ...(!expandeds[0] && { borderBottomColor: '#7f7f7f', borderBottomWidth: 1 }), backgroundColor: '#fafafa', },]}
                >
                    <List.Item title={
                        `Le livreur arrive au restaurant en ${uberResponse.quote.pickup_duration} minutes (estimation)`
                    } titleStyle={{
                        alignSelf: "flex-start",
                        fontFamily: 'Roboto-BoldItalic',
                        fontSize: 16,
                        color: '#424242',
                    }} />
                    <List.Item title={
                        // Apres cette date vous ne pouvez pas faire cette création de livraison
                        `Date limite de création de livraison : ${formatDate(uberResponse.quote.expires)}`
                    } titleStyle={{
                        alignSelf: "flex-start",
                        fontFamily: 'Roboto-BoldItalic',
                        fontSize: 16,
                        color: '#424242',
                    }} />
                    <List.Item title={
                        `Frais : ${uberResponse.quote?.fee / 100} ${uberResponse.quote.currency_type}`
                    } titleStyle={{
                        alignSelf: "flex-start",
                        fontFamily: 'Roboto-BoldItalic',
                        fontSize: 16,
                        color: '#424242',
                    }} />

                </List.Accordion>

                <List.Accordion
                    expanded={expandeds[1]}
                    onPress={() => setExpandeds([expandeds[0], !expandeds[1]])}
                    descriptionStyle={{ fontFamily: 'Roboto-Light', fontSize: 12 }}
                    title="Client informations(Dropoff)" titleStyle={{ color: expandeds[1] ? "#5cd964" : "#7f7f7f", fontFamily: 'Robot-Regular' }}
                    left={props => <List.Icon {...props} icon="information" color={expandeds[1] ? "#5cd964" : "#7f7f7f"} />} rippleColor={"#5cd964"}
                    style={[{ backgroundColor: '#fafafa' }]}
                >
                    <List.Item title={
                        `Le livreur arrive au client en ${uberResponse.quote.duration} minutes (estimation)`
                    } titleStyle={{
                        alignSelf: "flex-start",
                        fontFamily: 'Roboto-BoldItalic',
                        fontSize: 16,
                        color: '#424242',
                    }} />

                </List.Accordion>
            </List.Section>}

            {uberResponse.create !== undefined && <List.Section style={{ marginTop: "5%" }}>
                <List.Accordion
                    expanded={expandeds[0]}
                    onPress={() => setExpandeds([!expandeds[0], expandeds[1], expandeds[2], expandeds[3]])}
                    descriptionStyle={{ fontFamily: 'Roboto-Light', fontSize: 12 }}
                    title="Global informations" titleStyle={{ color: expandeds[0] ? "#5cd964" : "#7f7f7f", fontFamily: 'Robot-Regular' }}
                    left={props => <List.Icon {...props} icon="information" color={expandeds[0] ? "#5cd964" : "#7f7f7f"} />} rippleColor={"#5cd964"}
                    style={[{ ...(!expandeds[0] && { borderBottomColor: '#7f7f7f', borderBottomWidth: 1 }), backgroundColor: '#fafafa', },]}>
                    <List.Item title={
                        `status : ${uberResponse.create.status}`
                    } titleStyle={{
                        alignSelf: "flex-start",
                        fontFamily: 'Roboto-BoldItalic',
                        fontSize: 16,
                        color: '#424242',
                    }} />
                    <List.Item title={
                        `complete : ${uberResponse.create.complete}`
                    } titleStyle={{
                        alignSelf: "flex-start",
                        fontFamily: 'Roboto-BoldItalic',
                        fontSize: 16,
                        color: '#424242',
                    }} />
                    <List.Item title={
                        `Fee : ${uberResponse.create?.fee / 100} ${uberResponse.create.currency}`
                    } titleStyle={{
                        alignSelf: "flex-start",
                        fontFamily: 'Roboto-BoldItalic',
                        fontSize: 16,
                        color: '#424242',
                    }} />


                </List.Accordion>

                <List.Accordion
                    expanded={expandeds[1]}
                    onPress={() => setExpandeds([expandeds[0], !expandeds[1], expandeds[2], expandeds[3]])}
                    descriptionStyle={{ fontFamily: 'Roboto-Light', fontSize: 12 }}
                    title="Courier informations" titleStyle={{ color: expandeds[1] ? "#5cd964" : "#7f7f7f", fontFamily: 'Robot-Regular' }}
                    left={props => <List.Icon {...props} icon="information" color={expandeds[1] ? "#5cd964" : "#7f7f7f"} />} rippleColor={"#5cd964"}

                    style={[{ ...(!expandeds[1] && { borderBottomColor: '#7f7f7f', borderBottomWidth: 1 }), backgroundColor: '#fafafa', },]}
                >

                    <List.Item title={
                        `name : ${uberResponse.create.courier?.name}`
                    } titleStyle={{
                        alignSelf: "flex-start",
                        fontFamily: 'Roboto-BoldItalic',
                        fontSize: 16,
                        color: '#424242',
                    }} />
                    <List.Item title={
                        `vehicle_type : ${uberResponse.create.courier?.vehicle_type}`
                    } titleStyle={{
                        alignSelf: "flex-start",
                        fontFamily: 'Roboto-BoldItalic',
                        fontSize: 16,
                        color: '#424242',
                    }} />
                    <List.Item title={
                        `Phone number : ${uberResponse.create.courier?.phone_number}`
                    } titleStyle={{
                        alignSelf: "flex-start",
                        fontFamily: 'Roboto-BoldItalic',
                        fontSize: 16,
                        color: '#424242',
                    }} />


                </List.Accordion>

                <List.Accordion
                    expanded={expandeds[2]}
                    onPress={() => setExpandeds([expandeds[0], expandeds[1], !expandeds[2], expandeds[3]])}
                    descriptionStyle={{ fontFamily: 'Roboto-Light', fontSize: 12 }}
                    title="Client informations(Dropoff)" titleStyle={{ color: expandeds[2] ? "#5cd964" : "#7f7f7f", fontFamily: 'Robot-Regular' }}
                    left={props => <List.Icon {...props} icon="information" color={expandeds[2] ? "#5cd964" : "#7f7f7f"} />} rippleColor={"#5cd964"}
                    style={[{ ...(!expandeds[2] && { borderBottomColor: '#7f7f7f', borderBottomWidth: 1 }), backgroundColor: '#fafafa', },]}
                >
                    <List.Item title={
                        `dropoff_deadline : ${formatDate(uberResponse.create.dropoff_deadline)}`
                    } titleStyle={{
                        alignSelf: "flex-start",
                        fontFamily: 'Roboto-BoldItalic',
                        fontSize: 16,
                        color: '#424242',
                    }} />
                    <List.Item title={
                        `dropoff_eta : ${formatDate(uberResponse.create.dropoff_eta)}`
                    } titleStyle={{
                        alignSelf: "flex-start",
                        fontFamily: 'Roboto-BoldItalic',
                        fontSize: 16,
                        color: '#424242',
                    }} />
                    <List.Item title={
                        `dropoff_ready : ${formatDate(uberResponse.create.dropoff_ready)}`
                    } titleStyle={{
                        alignSelf: "flex-start",
                        fontFamily: 'Roboto-BoldItalic',
                        fontSize: 16,
                        color: '#424242',
                    }} />
                    <List.Item title={
                        `status : ${uberResponse.create.dropoff.status}`
                    } titleStyle={{
                        alignSelf: "flex-start",
                        fontFamily: 'Roboto-BoldItalic',
                        fontSize: 16,
                        color: '#424242',
                    }} />

                </List.Accordion>

                <List.Accordion
                    expanded={expandeds[3]}
                    onPress={() => setExpandeds([expandeds[0], expandeds[1], expandeds[2], !expandeds[3]])}
                    descriptionStyle={{ fontFamily: 'Roboto-Light', fontSize: 12 }}
                    title="Restaurant informations(Pickup)" titleStyle={{ color: expandeds[3] ? "#5cd964" : "#7f7f7f", fontFamily: 'Robot-Regular' }}
                    left={props => <List.Icon {...props} icon="information" color={expandeds[3] ? "#5cd964" : "#7f7f7f"} />} rippleColor={"#5cd964"}
                    style={[{ backgroundColor: '#fafafa', }]}
                >
                    <List.Item title={
                        `pickup_deadline : ${formatDate(uberResponse.create.pickup_deadline)}`
                    } titleStyle={{
                        alignSelf: "flex-start",
                        fontFamily: 'Roboto-BoldItalic',
                        fontSize: 16,
                        color: '#424242',
                    }} />
                    <List.Item title={
                        `pickup_eta : ${formatDate(uberResponse.create.pickup_eta)}`
                    } titleStyle={{
                        alignSelf: "flex-start",
                        fontFamily: 'Roboto-BoldItalic',
                        fontSize: 16,
                        color: '#424242',
                    }} />

                    <List.Item title={
                        `pickup_ready : ${formatDate(uberResponse.create.pickup_ready)}`
                    } titleStyle={{
                        alignSelf: "flex-start",
                        fontFamily: 'Roboto-BoldItalic',
                        fontSize: 16,
                        color: '#424242',
                    }} />


                    <List.Item title={
                        `status : ${uberResponse.create.pickup.status}`
                    } titleStyle={{
                        alignSelf: "flex-start",
                        fontFamily: 'Roboto-BoldItalic',
                        fontSize: 16,
                        color: '#424242',
                    }} />

                </List.Accordion>


            </List.Section>}

        </ScrollView >
    )
}
