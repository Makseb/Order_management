import Modal from "react-native-modal";
import { View, Text, StyleSheet, TouchableWithoutFeedback, TouchableOpacity } from "react-native"
import AntDesign from "react-native-vector-icons/AntDesign"
import ThermalPrinterModule from 'react-native-thermal-printer';
import { kitchen, receipt } from "../../../../../utils/utils-function";
import { useSelector } from "react-redux";
import { Checkbox } from "react-native-paper";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Toast from "react-native-toast-message";

export default function PrintModal({ modalProps }) {
    const { t: translation } = useTranslation();

    const { toggleModal, setToggleModal, order } = modalProps
    // print the ips selected
    const lankitchen = useSelector((state) => state.printer.lankitchen)
    const lanreceipt = useSelector((state) => state.printer.lanreceipt)

    // get currency
    const currency = useSelector((state) => state.authentification.storeSelected.currency)

    // get store

    const store = useSelector((state) => state.authentification.storeSelected.store)

    console.log(store);

    const [checkedKitchen, setCheckedKitchen] = useState()
    const [checkedReceipt, setCheckedReceipt] = useState()

    return (

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
                    <View style={{
                        flexDirection: 'row'
                    }}>
                        <Checkbox.Item status={checkedKitchen ? 'checked' : 'unchecked'} label={translation("Kitchen printer")} color="#df8f17" onPress={() => { setCheckedKitchen(!checkedKitchen) }} labelStyle={{
                            color: '#030303',
                            fontFamily: 'Montserrat-Light',
                            borderRadius: 24,
                            fontSize: 12,
                            lineHeight: 45,
                        }} />
                        <Checkbox.Item status={checkedReceipt ? 'checked' : 'unchecked'} label={translation("Receipt printer")} color="#df8f17" onPress={() => { setCheckedReceipt(!checkedReceipt) }} labelStyle={{
                            color: '#030303',
                            fontFamily: 'Montserrat-Light',
                            borderRadius: 24,
                            fontSize: 12,
                            lineHeight: 45,
                        }} />
                    </View>
                    <View style={styles.printContainer}>
                        <TouchableOpacity style={styles.printButton} onPress={async () => {
                            if (checkedKitchen || checkedReceipt) {
                                setToggleModal(false)
                                try {
                                    if (checkedKitchen) {
                                        for (let i = 0; i < lankitchen.length; i++) {
                                            await ThermalPrinterModule.printTcp({
                                                ip: lankitchen[i].ip,
                                                port: 9100,
                                                payload: kitchen(order, currency, store),
                                                timeout: 30000, // in milliseconds 
                                            });
                                        }
                                    }
                                    if (checkedReceipt) {
                                        for (let i = 0; i < lanreceipt.length; i++) {
                                            await ThermalPrinterModule.printTcp({
                                                ip: lanreceipt[i].ip,
                                                port: 9100,
                                                payload: receipt(order, currency, store),
                                                timeout: 30000, // in milliseconds 
                                            });
                                        }
                                    }

                                } catch (err) {
                                    //error handling
                                    console.log(err.message);
                                }
                            } else {
                                Toast.show({
                                    type: 'error',
                                    text1: translation("Please select at least one."),
                                });
                            }
                        }}>
                            <Text style={styles.textPrintButton}>{translation("Print")}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal >

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
    printContainer: {
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: '3%'
    },
    printButton: {
        height: 45,
        width: '30%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#5cd964',
        borderRadius: 22,
    },
    textPrintButton: {
        color: 'white',
        fontFamily: 'Montserrat-Regular',
        fontSize: 18,
    },
})