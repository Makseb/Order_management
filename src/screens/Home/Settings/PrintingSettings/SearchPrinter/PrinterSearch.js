import { useRoute } from "@react-navigation/native";
import { LanModal, Header, BluetoothModal } from "../../../../exports";
import { store } from "../../../../../shared";
import { useSelector } from "react-redux";
import { resetBluetooth, setBluetooth, setLan } from "../../../../../shared/slices/Printer/PrinterSlice";
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, NativeModules, StyleSheet, TouchableWithoutFeedback, ScrollView, Platform, PermissionsAndroid } from "react-native";
import { setRootLoading } from "../../../../../shared/slices/rootSlice";
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { useTranslation } from "react-i18next";
import { BluetoothManager, BluetoothEscposPrinter, BluetoothTscPrinter } from 'react-native-bluetooth-escpos-printer';
import BleManager from 'react-native-ble-manager';


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


    const bluetoothScan = async () => {
        store.dispatch(setRootLoading(true))
        await BluetoothManager.scanDevices()
            .then((s) => {
                const ss = JSON.parse(s);
                store.dispatch(setBluetooth({ bluetooth: ss.found }));
            }, (er) => {
                alert('error' + JSON.stringify(er));
            });
        store.dispatch(setRootLoading(false))
        setShowText({
            value: "bluetooth",
            state: true
        })
    }


    const requestPermissions = async () => {
        let result = true
        await BluetoothManager.enableBluetooth().then((r) => {
        }).catch(err => {
            result = false
        })
        if (Platform.OS === 'android') {
            if (Platform.Version >= 23) {
                const granted = await PermissionsAndroid.check(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                );
                if (granted) {
                } else {
                    const grantedRequest = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    );
                    if (grantedRequest === "granted") {
                        console.log('User accepted the location permission');
                    } else {
                        result = false
                    }
                }
            } else {
                // Handle permissions for Android versions below 6.0
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    console.log('User accepted the location permission');
                } else {
                    result = false
                }
            }
        }
        return result
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
                                        <Text style={styles.textHostname}>{item.name}</Text>
                                        <Text style={styles.textIp}>{item.address}</Text>
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
                        if (await requestPermissions() === true) {
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