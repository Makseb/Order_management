import Modal from "react-native-modal";
import { View, Text, StyleSheet, TextInput, TouchableWithoutFeedback, TouchableOpacity } from "react-native"
import AntDesign from "react-native-vector-icons/AntDesign"
import { } from "react-native";
import { useState } from "react";
import { updateOrderStatus } from "../../shared/slices/Orders/OrdersService";
import { updateState } from "../../shared/slices/Orders/OrdersSlice";
import { store } from "../../shared";

export default function AcceptModal({ modalProps }) {
    const { toggleModal, setToggleModal, stage, index, orderId } = modalProps;

    const [minutes, setMinutes] = useState();
    const handleMinutesChange = (input) => {
        const numericInput = input.replace(/[^0-9]/g, '');

        const limitedInput = numericInput.slice(0, 2);

        setMinutes(limitedInput);
    };

    const [version, setVersion] = useState(false)
    return (
        <Modal
            isVisible={toggleModal}
            onBackdropPress={() => setToggleModal(false)}
            style={{ justifyContent: 'flex-end', margin: 0 }}
        >
            <View
                style={{
                    flexDirection: 'column',
                    backgroundColor: 'white',
                    alignItems: 'center',
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10,
                }}>
                <TouchableWithoutFeedback onPress={() => setToggleModal(!toggleModal)}>
                    <AntDesign
                        style={{
                            alignSelf: 'flex-start',
                            paddingTop: '1.5%',
                            paddingLeft: '1.5%',
                            fontFamily: 'Montserrat-Light',
                            color: '#030303'
                        }}
                        name="arrowleft"
                        size={20}
                    />
                </TouchableWithoutFeedback>
                <Text style={{
                    color: '#030303',
                    fontFamily: 'Montserrat-Light',
                    fontSize: 14,
                    marginBottom: '1%'
                }}>{version ? "Demandée retrait time" : "Retrait time"}</Text>


                {!version && <View style={styles.inputContainer}>
                    <AntDesign name="clockcircleo" size={20} style={{ color: '#716D6D', position: 'absolute', zIndex: 2, left: 10 }} />
                    <TextInput
                        style={styles.input}
                        placeholder="Minutes"
                        keyboardType="numeric"
                        placeholderTextColor="#030303"
                        value={minutes}
                        onChangeText={handleMinutesChange}
                    />
                </View>}
                {version && <View style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Text style={{
                        backgroundColor: '#F7F7F7',
                        color: '#030303',
                        fontFamily: 'Montserrat-Regular',
                        borderRadius: 24,
                        fontSize: 14,
                        textAlign: 'center',
                        lineHeight: 45,
                        width: '22%',
                    }}>jeu. 14 déc. - 16:00</Text>
                </View>
                }
                <View style={styles.acceptContainer}>
                    <TouchableOpacity style={styles.acceptButton} onPress={() => {
                        // update status in backend to accepted
                        const updateOrderStatusToAccepted = async () => {
                            await updateOrderStatus({ status: "accepted", _id: orderId, preparationtime: minutes }).then(res => {
                                store.dispatch(updateState({ index, action: "accepted", stage: stage, updatedAt: res.order.updatedAt, preparationTime: res.order.preparationtime }))
                            }).catch(err => {
                            })
                        }
                        updateOrderStatusToAccepted()
                        setToggleModal(false)
                    }}>
                        <Text style={styles.textAcceptButton}>Accept</Text>
                    </TouchableOpacity>
                </View>

            </View>
        </Modal>
    )

}

styles = StyleSheet.create({
    inputContainer: {
        width: '20%',
        height: 45,
        flexDirection: 'row',
        alignItems: 'center',
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
        width: '30%',
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