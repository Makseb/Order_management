import { StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import Modal from "react-native-modal";
import AntDesign from "react-native-vector-icons/AntDesign"
import { RadioButton } from "react-native-paper"
import { useSelector } from "react-redux";
import { store } from "../../../../../../shared";
import { setBluetoothKitchen, removeBluetoothKitchen, setBluetoothReceipt, removeBluetoothReceipt } from "../../../../../../shared/slices/Printer/PrinterSlice";
// import Toast from "react-native-toast-message";
import { Toast } from 'react-native-toast-message/lib/src/Toast';

export default function BluetoothModal({ modalProps }) {
    const { setToggleModalBluetooth, toggleModalBluetooth } = modalProps

    const bluetoothreceipt = useSelector((state) => state.printer.bluetoothreceipt)
    const bluetoothkitchen = useSelector((state) => state.printer.bluetoothkitchen)
    console.log("bluetoothreceipt");
    console.log(bluetoothreceipt);
    console.log("bluetoothkitchen");
    console.log(bluetoothkitchen);

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
                            label="Receipt printer"
                            value="Receipt printer"
                            labelStyle={styles.radioButton}
                            status={bluetoothreceipt?.find(printer => printer?.name === toggleModalBluetooth.value?.name) ? 'checked' : 'unchecked'}
                            onPress={async () => {
                                const exist = bluetoothkitchen?.find(printer => printer?.name === toggleModalBluetooth.value?.name)
                                if (exist || (bluetoothkitchen.length < 1 && bluetoothreceipt.length < 1)) {
                                    store.dispatch(removeBluetoothKitchen({ name: toggleModalBluetooth.value.name }))
                                    store.dispatch(setBluetoothReceipt({ bluetoothreceipt: toggleModalBluetooth.value }))
                                } else {
                                    Toast.show({
                                        type: 'error',
                                        text1: "You can select only one printer on printer",
                                    });
                                }
                            }
                            }
                        />
                        <RadioButton.Item
                            color="#df8f17"
                            label="Kitchen printer"
                            labelStyle={styles.radioButton}
                            value="Kitchen printer"
                            status={bluetoothkitchen?.find(printer => printer?.name === toggleModalBluetooth.value?.name) ? 'checked' : 'unchecked'}
                            onPress={async () => {
                                const exist = bluetoothreceipt?.find(printer => printer?.name === toggleModalBluetooth.value?.name)
                                if (exist || (bluetoothkitchen.length < 1 && bluetoothreceipt.length < 1)) {
                                    store.dispatch(removeBluetoothReceipt({ name: toggleModalBluetooth.value.name }))
                                    store.dispatch(setBluetoothKitchen({ bluetoothkitchen: toggleModalBluetooth.value }))
                                } else {
                                    Toast.show({
                                        type: 'error',
                                        text1: "You can select only one printer on printer",
                                    });
                                }
                            }
                            }
                        />
                    </View>
                </View>
            </View>
            <Toast />
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