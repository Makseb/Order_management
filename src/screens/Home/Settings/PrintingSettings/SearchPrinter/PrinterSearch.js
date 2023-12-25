import { useRoute } from "@react-navigation/native";
import { CheckBoxModal, Header } from "../../../../exports";
import { store } from "../../../../../shared";
import { useSelector } from "react-redux";
import { setLan } from "../../../../../shared/slices/Printer/PrinterSlice";
import { useState } from "react";
import { View, Text, TouchableOpacity, Image, NativeModules, StyleSheet } from "react-native";
import { setRootLoading } from "../../../../../shared/slices/rootSlice";
import CheckBox from '@react-native-community/checkbox';


export default function SearchPrinter() {
    const route = useRoute();
    const { title, description, img } = route.params;

    const lan = useSelector((state) => state.printer.lan)

    // use this to show or not logo and description
    const [state, setState] = useState(false)


    const [toggleModal, setToggleModal] = useState({
        state : false,
        value : null
    })
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
                alignItems: 'center'
            }}>
                <Image source={img} style={{
                    marginHorizontal: '5%',
                    width: '99%',
                    resizeMode: "contain"
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
                    <View style={{
                        marginHorizontal: '5%',
                    }}>
                        {
                            lan.map((item) => (
                                <View style={styles.container} key={item.ip}>
                                    <CheckBox
                                        value={false}
                                        onValueChange={(newValue) => {
                                            // console.log(newValue);
                                            setToggleModal({
                                                state : true,
                                                value : item
                                            })
                                        }}
                                        style={styles.checkbox}
                                    />
                                    <View style={styles.textContainer}>
                                        <Text style={{
                                            fontFamily: 'Roboto-Regular',
                                            fontSize: 16,
                                            color: '#030303'
                                        }}>{item.hostname}</Text>
                                        <Text style={{
                                            fontFamily: 'Roboto-Regular',
                                            fontSize: 12,
                                            color: '#030303'
                                        }}>{item.ip}</Text>
                                    </View>
                                </View>
                            ))
                        }
                    </View>
                )
            }
            {toggleModal && <CheckBoxModal modalProps={{ toggleModal, setToggleModal }} />}
            <View style={{
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'flex-end',
                alignItems: 'center',
                marginBottom: '5%',
            }}>
                <TouchableOpacity onPress={async () => {
                    store.dispatch(setRootLoading(true));
                    const scanNetwork = await NativeModules.MyNativeModule.scanNetwork()
                    store.dispatch(setRootLoading(false))
                    store.dispatch(setLan({ lan: scanNetwork }))
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


const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
    checkbox: {
        marginRight: 10,
    },
    textContainer: {
        flex: 1,
    },
});
