import { useRoute } from "@react-navigation/native";
import { LanModal, Header, BluetoothModal } from "../../../../exports";
import { store } from "../../../../../shared";
import { useSelector } from "react-redux";
import { resetBluetooth, setBluetooth, setLan } from "../../../../../shared/slices/Printer/PrinterSlice";
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, NativeModules, StyleSheet, TouchableWithoutFeedback, ScrollView, Platform, PermissionsAndroid, NativeAppEventEmitter } from "react-native";
import { setRootLoading } from "../../../../../shared/slices/rootSlice";
import BleManager from 'react-native-ble-manager';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { useTranslation } from "react-i18next";


export default function SearchPrinter() {
    const { t: translation } = useTranslation();

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
    console.log(bluetooth);
    console.log(showText.state && showText.value);
    // if bluetooth initilize it
    if (title === "Bluetooth") {
        useEffect(() => {
            const initialize = async () => {
                await requestPermissions()

                // Event listener for discovered peripherals
                NativeAppEventEmitter.addListener('BleManagerDiscoverPeripheral', (data) => {
                    // console.log(data.id);
                    if (data.id !== null) {
                        console.log(data);
                        store.dispatch(setBluetooth({ name: data?.name, id: data.id }));
                    }
                });
                NativeAppEventEmitter.addListener('BleManagerStopScan', () => {
                    store.dispatch(setRootLoading(false))
                    setShowText({
                        value: "bluetooth",
                        state: true
                    })
                });
                BleManager.start({ showAlert: false })
                    .then(() => {
                        // console.log('Bluetooth module initialized');
                    });
            };
            initialize();
        }, []);

    }
    // Function to initiate Bluetooth scan
    const bluetoothScan = async () => {
        store.dispatch(setRootLoading(true))
        await BleManager.scan([], 15);
    };


    const [permissions, setPermissions] = useState(true)
    const requestPermissions = async () => {
        await BleManager.checkState()
            .then(async (currentState) => {
                if (currentState === 'on') {
                } else {
                    await BleManager.enableBluetooth().then(() => {
                    }).catch((err) => {
                        setPermissions(false)
                    })
                }
            })

        if (Platform.OS === 'android' && Platform.Version >= 23) {
            PermissionsAndroid.check(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            ).then(result => {
                // console.log(result);
                if (result) {
                } else {
                    PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    ).then(result => {
                        if (result === "denied" || result === "never_ask_again") {
                            setPermissions(false)
                        }
                    });
                }
            })

        }
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
                            <TouchableWithoutFeedback key={index} onPress={() => setToggleModal({
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
                                <TouchableWithoutFeedback key={index} onPress={() => {
                                    setToggleModalBluetooth({
                                        state: true,
                                        value: item
                                    })
                                }}>
                                    <View style={{
                                        paddingVertical: '2%',
                                        marginHorizontal: '5%',
                                    }}>
                                        <Text style={styles.textHostname}>{item.id}</Text>
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
                    store.dispatch(setLan({ lan: [] }))
                    store.dispatch(resetBluetooth({ bluetooth: [] }))
                    if (title === "Bluetooth") {
                        // console.log(permissions);
                        if (permissions) {
                            bluetoothScan()
                        } else {
                            Toast.show({
                                type: 'error',
                                text1: translation('Please accept permission(s).'),
                            })
                        }
                    } else {
                        store.dispatch(setRootLoading(true));
                        const scanNetwork = await NativeModules.MyNativeModule.scanNetwork()
                        // console.log(scanNetwork);
                        let formattedData = []
                        for (let i = 0; i < scanNetwork.length; i++) {
                            formattedData[i] = scanNetwork[i]
                            formattedData[i].hostname = translation(scanNetwork[i].hostname.substring(0, scanNetwork[i].hostname.indexOf(" "))) +

                                scanNetwork[i].hostname.substring(scanNetwork[i].hostname.indexOf(" "), scanNetwork[i].hostname.length)
                            formattedData[i].ip = scanNetwork[i].ip
                        }
                        store.dispatch(setRootLoading(false))
                        store.dispatch(setLan({ lan: formattedData }))
                        setShowText({
                            value: "lan",
                            state: true
                        })
                    }
                }

                } style={styles.button}>
                    <Text style={styles.textButton}>{translation("Scan")}</Text>
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