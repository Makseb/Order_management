
import { StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import Modal from "react-native-modal";
import AntDesign from "react-native-vector-icons/AntDesign"
import { RadioButton } from "react-native-paper"
import { useSelector } from "react-redux";
import { store } from "../../../../../../shared";
import { setLanKitchen, setLanReceipt } from "../../../../../../shared/slices/Printer/PrinterSlice";
import { useState } from "react";

export default function CheckboxModal({ modalProps }) {
    const { setToggleModal, toggleModal } = modalProps
    const lankitchen = useSelector((state) => state.printer.lankitchen)
    const lanreceipt = useSelector((state) => state.printer.lanreceipt)
    return (
        <Modal
            isVisible={toggleModal.state}
            onBackdropPress={() => {
                setToggleModal({
                    ...toggleModal,
                    state: false,
                })
            }}
            style={{ justifyContent: 'flex-end', margin: 0 }}>
            <View style={styles.container}>
                <TouchableWithoutFeedback onPress={() => {
                    setToggleModal({
                        ...toggleModal,
                        state: false,
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
                    <View style={styles.containerRadioButton}>
                        <RadioButton.Item
                            label="Receipt printer"
                            value="Receipt printer"
                            labelStyle={styles.radioButton}

                            status={!!lanreceipt?.find(printer => printer?.ip === toggleModal.value?.ip) ? 'checked' : 'unchecked'}
                            onPress={async () => {
                                store.dispatch(setLanReceipt({ lanreceipt: toggleModal.value }))
                            }
                            }

                        />
                        <RadioButton.Item
                            label="Kitchen printer"
                            labelStyle={styles.radioButton}
                            value="Kitchen printer"
                            status={!!lankitchen?.find(printer => printer?.ip === toggleModal.value?.ip) ? 'checked' : 'unchecked'}
                            onPress={async () => {
                                store.dispatch(setLanKitchen({ lankitchen: toggleModal.value }))
                            }
                            }
                        />
                    </View>


                </View>
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
    containerRadioButton: {
        // marginBottom: '5%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    radioButton: {
        color: '#030303',
        fontFamily: 'Montserrat-Light',
        borderRadius: 24,
        fontSize: 16,
        lineHeight: 45,
    }
})