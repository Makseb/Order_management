import Modal from "react-native-modal";
import React, { useState } from "react";
import { Image, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign"
import { Text } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { getproofofdelivery } from "../../../../shared/slices/Delivery/DeliveryService";
import Toast from "react-native-toast-message";




export default function WayPointModal({ modalProps }) {
    const { wayPointModal, setWayPointModal } = modalProps
    const { t: translation } = useTranslation();

    const navigation = useNavigation()
    const [data, setData] = useState(null)
    return (
        <Modal
            isVisible={wayPointModal.state}
            onBackdropPress={() => {
                setWayPointModal({
                    state: false,
                    data: undefined
                })
            }} style={{ justifyContent: 'flex-end', margin: 0 }}>
            <Toast />
            <View style={styles.container}>
                <TouchableWithoutFeedback onPress={() => {
                    setWayPointModal({
                        state: false,
                        data: undefined
                    })
                }}>
                    <AntDesign
                        style={styles.iconClock}
                        name="arrowleft"
                        size={20}
                    />
                </TouchableWithoutFeedback>

                <View style={{
                    flexDirection: 'row',
                    marginBottom: '3%'
                }}>
                    <TouchableOpacity
                        onPress={() => {
                            const deliveryproof = async () => {
                                await getproofofdelivery(wayPointModal.data.uberId, wayPointModal.data.token, "pickup").then(res => {
                                    setData(`data:image/jpeg;base64,${res.data.document}`)
                                }).catch(err => {
                                    console.log(err);
                                    Toast.show({
                                        type: 'error',
                                        text1: err.response.data.message,
                                    })
                                })
                            }
                            deliveryproof()
                        }}
                        style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                        <Text style={styles.pickupText}>Pickup proof</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => {
                            const deliveryproof = async () => {
                                await getproofofdelivery(wayPointModal.data.uberId, wayPointModal.data.token, "dropoff").then(res => {
                                    setData(`data:image/jpeg;base64,${res.data.document}`)
                                }).catch(err => {
                                    Toast.show({
                                        type: 'error',
                                        text1: err.response.data.message,
                                    })
                                })
                            }
                            deliveryproof()
                        }}
                        style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                        <Text style={styles.dropoffText}>Dropoff proof</Text>
                    </TouchableOpacity>
                </View>

                {data !== null &&
                    <View style={{
                        marginHorizontal: "1.5%",
                    }}>
                        <Image
                            source={{ uri: data }}
                            style={{
                                width: "100%",
                                aspectRatio: 13 / 9,
                                resizeMode: "contain",
                            }}
                        />
                    </View>}

            </View>


        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: 'white',
        alignItems: 'center',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    iconClock: {
        alignSelf: 'flex-start',
        paddingTop: '1.5%',
        paddingLeft: '1.5%',
        fontFamily: 'Montserrat-Light',
        color: '#030303',
    },

    pickupText: {
        paddingHorizontal: '3%',
        backgroundColor: '#f4f4f4f4',
        color: '#030303',
        fontFamily: 'Roboto-Light',
        borderRadius: 24,
        fontSize: 16,
        lineHeight: 45,
    },
    dropoffText: {
        paddingHorizontal: '3%',
        backgroundColor: '#f4f4f4f4',
        color: '#030303',
        fontFamily: 'Roboto-Light',
        borderRadius: 24,
        fontSize: 16,
        lineHeight: 45,
        marginLeft: '1%',
    }
})