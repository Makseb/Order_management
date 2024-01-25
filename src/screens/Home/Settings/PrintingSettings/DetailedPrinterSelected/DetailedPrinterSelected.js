import { useNavigation, useRoute } from "@react-navigation/native";
import { StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import { Text } from "react-native-paper";
import Feather from "react-native-vector-icons/Feather";
import { Header } from "../../../../exports"
import { store } from "../../../../../shared";
import { removeBluetoothKitchen, removeBluetoothReceipt, removeLanKitchen, removeLanReceipt } from "../../../../../shared/slices/Printer/PrinterSlice";
import { useTranslation } from "react-i18next";
export default function DetailedPrinterSelected() {
    const route = useRoute();
    const { printer, from, technology } = route.params;
    const navigation = useNavigation()
    const { t: translation } = useTranslation();

    const disconnectFromPeripheral = id => {
        BleManager.removeBond(id)
            .then(() => {
                peripheral.connected = false;
            })
            .catch(() => {
                Toast.show({
                    type: 'error',
                    text1: translation("Failed to disconnect from printer"),
                })
            });
    };

    return (
        <View style={styles.container}>
            <Header />
            <View style={{
                marginHorizontal: '5%'
            }}>

                {technology === "lan" ? <Text style={styles.textHostName}>
                    {printer.hostname}
                </Text> : <Text style={styles.textName}>{printer.name}</Text>}

                <View >
                    <Text style={styles.textType}>{translation("Type")}</Text>
                    <Text style={styles.textFrom}>{translation(from)}</Text>
                </View>

                {technology === "lan" && <View><Text style={styles.textIpAddress}>{translation("Ip address")}</Text>
                    <Text style={styles.textPrinterIp}>{printer.ip}</Text></View>}

                <View style={styles.barVerticale} />

                <TouchableWithoutFeedback onPress={() => {
                    navigation.goBack();
                    if (technology === "lan") {
                        if (from === "Receipt printer") {
                            store.dispatch(removeLanReceipt({ ip: printer.ip }))
                        } else {
                            store.dispatch(removeLanKitchen(({ ip: printer.ip })))
                        }
                    } else {
                        // disconnectFromPeripheral(printer.id)
                        if (from === "Receipt printer") {
                            store.dispatch(removeBluetoothReceipt({ id: printer.id }))
                        } else {
                            store.dispatch(removeBluetoothKitchen({ id: printer.id }))
                        }
                    }
                }}>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}>
                        <Feather name="trash-2" size={16} color={'#ff3b30'} style={{
                            marginRight: '2%'
                        }} />
                        <Text style={styles.textRemovePrinter}>{translation("Remove printer")}</Text>
                    </View>

                </TouchableWithoutFeedback>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    textHostName: {
        marginBottom: '2%',
        color: '#030303',
        fontSize: 20,
        fontFamily: 'Montserrat-Regular'
    },
    textName: {
        marginBottom: '2%',
        color: '#030303',
        fontSize: 20,
        fontFamily: 'Montserrat-Regular'
    },
    textType: {
        fontFamily: "Roboto-Light",
        color: "#7f7f7f",
        fontSize: 14
    },
    textFrom: {
        fontFamily: "Roboto-Light",
        color: "#030303",
        fontSize: 16,
        marginBottom: '2%'
    },
    textIpAddress: {
        fontFamily: "Roboto-Light",
        color: "#7f7f7f",
        fontSize: 14
    },
    textPrinterIp: {
        fontFamily: "Roboto-Light",
        color: "#030303",
        fontSize: 16,
    },
    barVerticale: {
        borderBottomColor: '#f0f0f0',
        borderBottomWidth: 1,
        marginVertical: '5%',
    },
    textRemovePrinter: {
        fontFamily: "Roboto-Regular",
        color: "#ff3b30",
        fontSize: 18
    }
})