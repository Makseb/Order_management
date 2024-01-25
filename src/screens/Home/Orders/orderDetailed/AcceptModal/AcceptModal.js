import Modal from "react-native-modal";
import { View, Text, StyleSheet, TextInput, TouchableWithoutFeedback, TouchableOpacity } from "react-native"
import AntDesign from "react-native-vector-icons/AntDesign"
import { useState } from "react";
import { updateState } from "../../../../../shared/slices/Orders/OrdersSlice";
import { updateOrderStatus } from "../../../../../shared/slices/Orders/OrdersService";
import { store } from "../../../../../shared";
import { useSelector } from "react-redux";
import Toast from "react-native-toast-message";
import { useTranslation } from "react-i18next";

export default function AcceptModal({ modalProps }) {
    const { t: translation } = useTranslation();

    const { toggleModal, setToggleModal, stage, id, orderId, preparedAt } = modalProps;

    // get notification id from redux
    const notificationId = useSelector((state) => state.authentification.notificationId)

    const [minutes, setMinutes] = useState(null);
    const handleMinutesChange = (input) => {
        const numericInput = input.replace(/[^0-9]/g, '');
        const limitedInput = numericInput.slice(0, 2);
        setMinutes(limitedInput);
    };
    return (
        <>
            <Modal
                isVisible={toggleModal}
                onBackdropPress={() => setToggleModal(false)}
                style={{ justifyContent: 'flex-end', margin: 0 }}>
                <Toast />
                <View
                    style={styles.container}>
                    <TouchableWithoutFeedback onPress={() => setToggleModal(!toggleModal)}>
                        <AntDesign
                            style={styles.iconClock}
                            name="arrowleft"
                            size={20}
                        />
                    </TouchableWithoutFeedback>
                    <Text style={styles.text}>{preparedAt ? translation("Request for preparing at") : translation("Prepared at")}</Text>


                    {!preparedAt && <View style={styles.inputContainer}>
                        <AntDesign name="clockcircleo" size={20} style={{ color: '#716D6D', position: 'absolute', zIndex: 2, left: 10 }} />
                        <TextInput
                            style={styles.input}
                            placeholder={translation("Minutes")}
                            keyboardType="numeric"
                            placeholderTextColor="#030303"
                            value={minutes}
                            onChangeText={handleMinutesChange}
                        />
                    </View>}
                    {preparedAt && <View style={styles.containerPreparation}>
                        <Text style={styles.textPreparation}>{preparedAt.date} {preparedAt.time}</Text>
                    </View>
                    }
                    <View style={styles.acceptContainer}>
                        <TouchableOpacity style={styles.acceptButton} onPress={() => {
                            if ((minutes === null || minutes === "") && !preparedAt) {
                                Toast.show({
                                    type: 'error',
                                    text1: translation("Please select time."),
                                });
                            } else {
                                // update status in backend to accepted
                                const updateOrderStatusToAccepted = async () => {
                                    !preparedAt ? (await updateOrderStatus({ status: "accepted", _id: orderId, preparationTime: minutes }, notificationId).then(res => {
                                        store.dispatch(updateState({ id, action: "accepted", stage: stage, updatedAt: res.order.updatedAt, preparedAt: res.order.preparedAt }))
                                    }).catch(err => { })
                                    ) : (
                                        await updateOrderStatus({ status: "accepted", _id: orderId }).then(res => {
                                            store.dispatch(updateState({ id, action: "accepted", stage: stage, updatedAt: res.order.updatedAt }, notificationId))
                                        }).catch(err => { })
                                    )
                                }
                                updateOrderStatusToAccepted()
                                setToggleModal(false)
                            }
                        }}>
                            <Text style={styles.textAcceptButton}>{translation("Accept")}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal >


        </>
    )

}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
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
        color: '#030303'
    },
    text: {
        color: '#030303',
        fontFamily: 'Montserrat-Light',
        fontSize: 14,
        marginBottom: '1%'
    },
    inputContainer: {
        width: '35%',
        height: 45,
        flexDirection: 'row',
        alignItems: 'center',
    },
    containerPreparation: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    textPreparation: {
        backgroundColor: '#F7F7F7',
        color: '#030303',
        fontFamily: 'Montserrat-Light',
        borderRadius: 24,
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 45,
        width: '22%',
    },
    input: {
        backgroundColor: 'white',
        color: '#030303',
        justifyContent: 'center',
        fontFamily: 'Montserrat-Light',
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 24,
        textAlign: 'center',
        fontSize: 14,
        flex: 1,
        height: 40,
    },
    acceptContainer: {
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: '3%'
    },
    acceptButton: {
        height: 45,
        width: '40%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#5cd964',
        borderRadius: 22,
    },
    textAcceptButton: {
        color: 'white',
        fontFamily: 'Montserrat-Regular',
        fontSize: 18,
    },
})