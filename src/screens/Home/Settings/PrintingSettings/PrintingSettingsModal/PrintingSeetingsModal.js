import Modal from "react-native-modal";
import React from "react";
import { StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign"
import { Text } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { Bluetooth, Lanwifi } from "../../../../../assets/images/exports";
import { useTranslation } from "react-i18next";

export default function PrintingSeetingsModal({ modalProps }) {
    const { toggleModal, setToggleModal } = modalProps
    const { t: translation } = useTranslation();

    const navigation = useNavigation()
    return (
        <Modal
            isVisible={toggleModal}
            onBackdropPress={() => {
                setToggleModal(false)
            }}
            style={{ justifyContent: 'flex-end', margin: 0 }}>
            <View style={styles.container}>
                <TouchableWithoutFeedback onPress={() => {
                    setToggleModal(false)
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
                    <TouchableWithoutFeedback onPress={() => {
                        navigation.navigate("SearchPrinter", { title: translation("Wired or wifi network"), description: translation("Make sure the printer and this device are connected to the same network."), img: Lanwifi })
                        setToggleModal(false)

                    }} style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <Text style={styles.wiredOrWifiNetworkText}>{translation("Wired or wifi network")}</Text>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => {
                        navigation.navigate("SearchPrinter", { title: "Bluetooth", description: translation("To connect to the Bluetooth printer, press the Bluetooth button on the printer for about 10 seconds, then press the \"Start Searching\" button in the app."), img: Bluetooth })
                        setToggleModal(false)
                    }} style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <Text style={styles.bluetoothText}>Bluetooth</Text>
                    </TouchableWithoutFeedback>
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
    wiredOrWifiNetworkText: {
        paddingHorizontal: '3%',
        backgroundColor: '#f4f4f4f4',
        color: '#030303',
        fontFamily: 'Roboto-Light',
        borderRadius: 24,
        fontSize: 16,
        lineHeight: 45,
    },
    bluetoothText: {
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