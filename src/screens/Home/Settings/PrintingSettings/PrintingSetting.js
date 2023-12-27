import { ScrollView, StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import { Text } from "react-native-paper";
import { Header, PrintingSettingsModal } from "../../../exports"
import AntDesign from "react-native-vector-icons/AntDesign";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

export default function PrintingSetting() {
    const lankitchen = useSelector((state) => state.printer.lankitchen)
    const lanreceipt = useSelector((state) => state.printer.lanreceipt)

    const [toggleModal, setToggleModal] = useState(false)

    const navigation = useNavigation()
    const bluetoothreceipt = useSelector((state) => state.printer.bluetoothreceipt)
    const bluetoothkitchen = useSelector((state) => state.printer.bluetoothkitchen)

    console.log("---");
    console.log(bluetoothreceipt);
    console.log("---");

    return (
        <View style={styles.container}>
            <Header />
            <Text style={[styles.textTitle, { marginBottom: (lankitchen?.length === 0 && lanreceipt?.length === 0) ? 0 : '2%' }]}>Select</Text>
            <View style={{
                marginHorizontal: '5%',
            }}>
                <ScrollView>
                    {
                        lankitchen.map((item, index) => {
                            return (
                                <TouchableWithoutFeedback key={item.ip} onPress={() => navigation.navigate("DetailedPrinterSelected", { technology: "lan", from: "Kitchen printer", printer: item })}>
                                    <View style={{
                                        marginBottom: '2%',
                                    }}>
                                        <Text style={styles.textHostName}>{item.hostname}</Text>
                                        <View style={{
                                            flexDirection: 'row', alignItems: 'flex-end'
                                        }}>
                                            <Text style={styles.textKitchenPrinter}>Kitchen printer </Text>
                                            <Text style={styles.textLanWifi}>- LAN/WIFI</Text>
                                        </View>
                                    </View>
                                </TouchableWithoutFeedback>
                            )
                        })
                    }
                    {
                        lanreceipt.map((item, index) => {
                            return (
                                <TouchableWithoutFeedback key={item.ip} onPress={() => navigation.navigate("DetailedPrinterSelected", { technology: "lan", from: "Receipt printer", printer: item })}>
                                    <View style={{
                                        marginBottom: index !== lanreceipt.length - 1 && '2%',
                                    }}>
                                        <Text style={styles.textHostName}>{item.hostname}</Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                                            <Text style={styles.textReceiptPrinter}>Receipt printer </Text>
                                            <Text style={styles.textLanWifi}>- LAN/WIFI</Text>
                                        </View>
                                    </View>
                                </TouchableWithoutFeedback>
                            )
                        })
                    }
                    {
                        bluetoothreceipt.map((item, index) => {
                            return (
                                <TouchableWithoutFeedback key={item.name} onPress={() => navigation.navigate("DetailedPrinterSelected", { technology: "bluetooth", from: "Receipt printer", printer: item })}>
                                    <View style={{
                                        marginBottom: index !== bluetoothreceipt.length - 1 && '2%',
                                    }}>
                                        <Text style={styles.textName}>{item.name}</Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                                            <Text style={styles.textReceiptPrinter}>Receipt printer </Text>
                                            <Text style={styles.textLanWifi}>- BLUETOOTH</Text>
                                        </View>
                                    </View>
                                </TouchableWithoutFeedback>
                            )
                        })
                    }
                    {
                        bluetoothkitchen.map((item, index) => {
                            return (
                                <TouchableWithoutFeedback key={item.name} onPress={() => navigation.navigate("DetailedPrinterSelected", { technology: "bluetooth", from: "Kitchen printer", printer: item })}>
                                    <View style={{
                                        marginBottom: index !== bluetoothkitchen.length - 1 && '2%',
                                    }}>
                                        <Text style={styles.textName}>{item.name}</Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                                            <Text style={styles.textReceiptPrinter}>Kitchen printer </Text>
                                            <Text style={styles.textLanWifi}>- BLUETOOTH</Text>
                                        </View>
                                    </View>
                                </TouchableWithoutFeedback>
                            )
                        })
                    }

                </ScrollView>
                <View style={styles.barHorizantale} />
                <View style={styles.containerButton}>
                    <AntDesign name="plus" size={20} color="#030303" />
                    <TouchableWithoutFeedback onPress={
                        () => setToggleModal(!toggleModal)
                    }>
                        <Text style={styles.textAddPrinter}>Add printer(s)</Text>
                    </TouchableWithoutFeedback >
                </View>

            </View>
            {toggleModal && <PrintingSettingsModal modalProps={{ toggleModal, setToggleModal }} />}
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    textTitle: {
        marginLeft: '5%',
        color: '#030303',
        fontSize: 20,
        fontFamily: 'Montserrat-Regular'
    },
    textHostName: {
        fontFamily: "Roboto-Light",
        color: "#030303",
        fontSize: 18
    },
    textName : {
        fontFamily: "Roboto-Light",
        color: "#030303",
        fontSize: 18
    },
    textKitchenPrinter: {
        fontFamily: "Roboto-Regular",
        color: "#7f7f7f",
        fontSize: 14
    },
    textLanWifi: {
        fontFamily: "Roboto-Light",
        color: "#7f7f7f",
        fontSize: 12
    },
    textReceiptPrinter: {
        fontFamily: "Roboto-Regular",
        color: "#7f7f7f",
        fontSize: 14
    },
    barHorizantale: {
        marginVertical: '5%',
        borderBottomColor: '#f0f0f0',
        borderBottomWidth: 1,
    },
    containerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: '2%'
    },
    textAddPrinter: {
        fontFamily: "Roboto-Regular",
        color: "#030303",
        fontSize: 18,
        marginLeft: '1%'
    }
})