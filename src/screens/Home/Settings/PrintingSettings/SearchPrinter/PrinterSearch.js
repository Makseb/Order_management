import { useRoute } from "@react-navigation/native";
import { LanModal, Header, BluetoothModal } from "../../../../exports";
import { store } from "../../../../../shared";
import { useSelector } from "react-redux";
import { setBluetooth, setLan } from "../../../../../shared/slices/Printer/PrinterSlice";
import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, NativeModules, StyleSheet, TouchableWithoutFeedback, ScrollView, Platform, PermissionsAndroid, NativeAppEventEmitter } from "react-native";
import { setRootLoading } from "../../../../../shared/slices/rootSlice";
import BleManager from 'react-native-ble-manager';


export default function SearchPrinter() {
    const route = useRoute();
    const { title, description, img } = route.params;
    const [showText, setShowText] = useState({
        value: null,
        state: false
    })

    // get ips
    const lan = useSelector((state) => state.printer.lan)

    // lan modal
    const [toggleModal, setToggleModal] = useState({
        state: false,
        value: null
    })

    // bluetooth modal
    const [toggleModalBluetooth, setToggleModalBluetooth] = useState({
        state: false,
        value: null
    })



    // get connected bluetooth
    const bluetooth = useSelector((state) => state.printer.bluetooth)

    // if bluetooth initilize it
    if (title === "Bluetooth") {
        useEffect(() => {
            const initialize = async () => {
                // Event listener for discovered peripherals
                NativeAppEventEmitter.addListener('BleManagerDiscoverPeripheral', (data) => {
                    store.dispatch(setBluetooth({ name: "test1" }));
                    store.dispatch(setBluetooth({ name: "test2" }));
                    if (data.name !== null) {
                        console.log(data.name);
                        store.dispatch(setBluetooth({ name: data.name }));
                    }
                });
                NativeAppEventEmitter.addListener('BleManagerStopScan', () => {
                    store.dispatch(setRootLoading(false))
                });
                BleManager.start({ showAlert: false })
                    .then(() => {
                        console.log('Bluetooth module initialized');
                    });
            };
            initialize();
        }, []);

    }
    // Function to initiate Bluetooth scan
    const bluetoothScan = async () => {
        store.dispatch(setRootLoading(true))
        await BleManager.scan([], 10);
    };


    const requestPermissions = async () => {
        const bluetoothScanPermission = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
            {
                title: "Location Permission",
                message: "Bluetooth Low Energy requires Location",
                buttonPositive: "OK",
            }
        );
        const bluetoothConnectPermission = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
            {
                title: "Location Permission",
                message: "Bluetooth Low Energy requires Location",
                buttonPositive: "OK",
            }
        );
        const fineLocationPermission = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
                title: "Location Permission",
                message: "Bluetooth Low Energy requires Location",
                buttonPositive: "OK",
            }
        );
        return (
            bluetoothScanPermission === "granted" &&
            bluetoothConnectPermission === "granted" &&
            fineLocationPermission === "granted"
        );
    };


    return (
        <View style={{
            backgroundColor: 'white',
            flex: 1
        }}>
            <Header />
            <Text style={styles.textTitle}>{title}</Text>

            {showText.state === false && <View style={{
                alignItems: 'center'
            }}>
                <Image source={img} style={styles.image} />
                <Text style={styles.textDescription}>
                    {description}
                </Text>
            </View>}

            {/* mapping lan */}
            {showText.state && showText.value === "lan" && <ScrollView>
                {
                    lan.map((item, index) => {
                        return (
                            <TouchableWithoutFeedback key={item.ip} onPress={() => setToggleModal({
                                state: true,
                                value: item
                            })}>
                                <View style={{
                                    paddingVertical: '2%',
                                    marginHorizontal: '5%',
                                }}>
                                    <Text style={styles.textHostname}>{item.hostname}</Text>
                                    <Text style={styles.textIp}>{item.ip}</Text>
                                </View>
                            </TouchableWithoutFeedback>
                        )
                    })
                }
            </ScrollView>
            }
            {/* mapping bluetooth */}
            {
                showText.state && showText.value === "bluetooth" && <ScrollView>
                    {
                        bluetooth.map((item, index) => {
                            return (
                                <TouchableWithoutFeedback key={item.name} onPress={() => {
                                    setToggleModalBluetooth({
                                        state: true,
                                        value: item
                                    })
                                }}>
                                    <View style={{
                                        paddingVertical: '2%',
                                        marginHorizontal: '5%',
                                    }}>
                                        <Text style={styles.textHostname}>{item.name}</Text>
                                    </View>
                                </TouchableWithoutFeedback>
                            )
                        })
                    }
                </ScrollView>
            }

            {/* showing modal for lan */}
            {toggleModal.state && <LanModal modalProps={{ toggleModal, setToggleModal }} />}

            {/* showing modal for bluetooth */}
            {toggleModalBluetooth.state && <BluetoothModal modalProps={{ toggleModalBluetooth, setToggleModalBluetooth }} />}


            <View style={styles.containerButton}>
                <TouchableOpacity onPress={async () => {
                    if (title === "Bluetooth") {
                        if (requestPermissions()) {
                            bluetoothScan()
                            setShowText({
                                value: "bluetooth",
                                state: true
                            })
                        }
                    } else {
                        store.dispatch(setRootLoading(true));
                        const scanNetwork = await NativeModules.MyNativeModule.scanNetwork()
                        store.dispatch(setRootLoading(false))
                        store.dispatch(setLan({ lan: scanNetwork }))
                        setShowText({
                            value: "lan",
                            state: true
                        })
                    }
                }
                } style={styles.button}>
                    <Text style={styles.textButton}>Scan</Text>
                </TouchableOpacity>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    textTitle: {
        marginLeft: '5%',
        marginBottom: '2%',
        color: '#030303',
        fontSize: 20,
        fontFamily: 'Montserrat-Regular'
    },
    image: {
        marginHorizontal: '5%',
        width: '99%',
        resizeMode: "contain"
    },
    textDescription: {
        marginHorizontal: '5%',
        fontSize: 18,
        fontFamily: 'Roboto-Light',
        letterSpacing: 1
    },
    textHostname: {
        fontFamily: "Roboto-Light",
        color: "#030303",
        fontSize: 18,
    },
    textIp: {
        fontFamily: "Roboto-Light",
        color: "#7f7f7f",
        fontSize: 14
    },
    containerButton: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginBottom: '5%',
    },
    button: {
        backgroundColor: '#df8f17',
        borderRadius: 24,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 55,
        width: '40%',
    },
    textButton: {
        fontFamily: 'Montserrat-Regular',
        color: 'white',
        fontSize: 18,
    }
})