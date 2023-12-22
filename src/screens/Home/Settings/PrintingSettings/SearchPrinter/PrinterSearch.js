import { useRoute } from "@react-navigation/native";
import { Header } from "../../../../exports";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { store } from "../../../../../shared";
import { useSelector } from "react-redux";
import { setConfig } from "../../../../../shared/slices/Printer/PrinterSlice";
import { useState } from "react";
import { BleManager } from 'react-native-ble-plx';

export default function SearchPrinter() {
    const route = useRoute();
    const { title, description, img } = route.params;

    const config = useSelector((state) => state.printer.config)
    console.log(config);

    // use this to show or not logo of bluetooth and description
    const [state, setState] = useState(false)
    return (
        <View style={{
            backgroundColor: 'white',
            flex: 1
        }}>
            <Header />
            <Text style={{
                marginLeft: '5%',
                marginBottom: '2%',
                color: '#030303',
                fontSize: 20,
                fontFamily: 'Montserrat-Regular'
            }}>{title}</Text>

            {state === false && <View style={{
                // justifyContent: 'center',
                alignItems: 'center'
            }}>
                <Image source={img} style={{
                    marginHorizontal: '5%',
                }} />

                <Text style={{
                    marginHorizontal: '5%',
                    fontSize: 18,
                    fontFamily: 'Roboto-Light',
                    letterSpacing: 1
                }}>
                    {description}
                </Text>
            </View>}
            {
                state && (
                    <View>

                    </View>
                )
            }


            <View style={{
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'flex-end',
                alignItems: 'center',
                marginBottom: '5%',
            }}>
                <TouchableOpacity onPress={() => {
                    // store.dispatch(setConfig({ config: "192.168.1.192" }))
                    setState(true)
                }
                } style={{
                    backgroundColor: '#df8f17',
                    borderRadius: 24,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 55,
                    width: '40%',
                }}>
                    <Text style={{
                        fontFamily: 'Montserrat-Regular',
                        color: 'white',
                        fontSize: 18,
                    }}>Start searching</Text>
                </TouchableOpacity>
            </View>

        </View>
    )
}