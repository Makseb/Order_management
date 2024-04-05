import { StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import Modal from "react-native-modal";
import AntDesign from "react-native-vector-icons/AntDesign"
import { RadioButton } from "react-native-paper"
import { useSelector } from "react-redux";
import { store } from "../../../../../../shared";
import { setBluetoothKitchen, removeBluetoothKitchen, setBluetoothReceipt, removeBluetoothReceipt } from "../../../../../../shared/slices/Printer/PrinterSlice";
import Toast from "react-native-toast-message";
import { useTranslation } from "react-i18next";
import { BluetoothManager, BluetoothEscposPrinter, BluetoothTscPrinter } from 'react-native-bluetooth-escpos-printer';

export default function BluetoothModal({ modalProps }) {
    const { t: translation } = useTranslation();

    const { setToggleModalBluetooth, toggleModalBluetooth } = modalProps

    const bluetoothreceipt = useSelector((state) => state.printer.bluetoothreceipt)
    const bluetoothkitchen = useSelector((state) => state.printer.bluetoothkitchen)

    const connectToPeripheral = async (address,type) => {
        await BluetoothManager.connect(address)
            .then((s) => {
                if(type==="receipt"){
                    store.dispatch(setBluetoothReceipt({ bluetoothreceipt: toggleModalBluetooth.value }))
                }else{
                    store.dispatch(setBluetoothKitchen({ bluetoothkitchen: toggleModalBluetooth.value }))
                }
            }, (e) => {
                console.log(e);
                alert(e);
            })
    };

    return (
        <Modal
            isVisible={toggleModalBluetooth.state}
            onBackdropPress={() => {
                setToggleModalBluetooth({
                    ...toggleModalBluetooth,
                    state: false,
                })
            }}
            style={{ justifyContent: 'flex-end', margin: 0 }}>
            <Toast />

            <View style={styles.container}>
                <TouchableWithoutFeedback onPress={() => {
                    setToggleModalBluetooth({
                        ...toggleModalBluetooth,
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
                            color="#df8f17"
                            label={translation("Receipt printer")}
                            value="Receipt printer"
                            labelStyle={styles.radioButton}
                            status={bluetoothreceipt?.find(printer => printer?.address === toggleModalBluetooth.value?.address) ? 'checked' : 'unchecked'}
                            onPress={async () => {
                                const exist = bluetoothkitchen?.find(printer => printer?.address === toggleModalBluetooth.value?.address)
                                if (exist || (bluetoothkitchen.length < 1 && bluetoothreceipt.length < 1)) {
                                    // the first connection between two devices
                                    if (!exist) {
                                        connectToPeripheral(toggleModalBluetooth.value.address,"receipt")
                                    } else {
                                        store.dispatch(removeBluetoothKitchen({ address: toggleModalBluetooth.value.address }))
                                        store.dispatch(setBluetoothReceipt({ bluetoothreceipt: toggleModalBluetooth.value }))
                                    }
                                } else {
                                    Toast.show({
                                        type: 'error',
                                        text1: translation("You can select only one printer on printer"),
                                    });
                                }
                            }
                            }
                        />
                        <RadioButton.Item
                            color="#df8f17"
                            label={translation("Kitchen printer")}
                            labelStyle={styles.radioButton}
                            value="Kitchen printer"
                            status={bluetoothkitchen?.find(printer => printer?.address === toggleModalBluetooth.value?.address) ? 'checked' : 'unchecked'}
                            onPress={async () => {
                                const exist = bluetoothreceipt?.find(printer => printer?.address === toggleModalBluetooth.value?.address)
                                if (exist || (bluetoothkitchen.length < 1 && bluetoothreceipt.length < 1)) {

                                    // the first connection between two devices
                                    if (!exist) {
                                        connectToPeripheral(toggleModalBluetooth.value.address,"kitchen")
                                    } else {
                                        store.dispatch(removeBluetoothReceipt({ address: toggleModalBluetooth.value.address }))
                                        store.dispatch(setBluetoothKitchen({ bluetoothkitchen: toggleModalBluetooth.value }))
                                    }
                                } else {
                                    Toast.show({
                                        type: 'error',
                                        text1: translation("You can select only one printer on printer"),
                                    });
                                }
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
        fontSize: 12,
        lineHeight: 45,
    }
})