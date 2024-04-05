import { TouchableWithoutFeedback, View, Text, ScrollView } from "react-native";
import Header from "../../Header/Header";
import { useSelector } from "react-redux";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { store } from "../../../../shared";
import { setOption, setOptionsOff } from "../../../../shared/slices/Delivery/DeliverySlice";
import { useState } from "react";
import DeliverySettingsModal from "./DeliverySettingsModal/DeliverySettingsModal";
import { Switch } from 'react-native-paper';
import Toast from 'react-native-toast-message';



export default function DeliverySettings() {
    const deliveryOptions = useSelector((state) => state.delivery.organizations)
    const [toggleModal, setToggleModal] = useState({
        state: false,
        data: undefined
    })
    const organizations = useSelector((state) => state.delivery.organizations)

    const checkedCount = organizations.reduce((acc, org) => {
        return acc + org.options.filter(option => option.checked).length;
    }, 0);

    console.log(checkedCount);

    return (
        <ScrollView style={{
            flex: 1,
            backgroundColor: 'white',
        }}>
            <Header />
            <Text style={{
                marginLeft: '5%',
                marginBottom: '2%',
                color: '#030303',
                fontSize: 20,
                fontFamily: 'Montserrat-Regular'
            }}>Delivery Settings</Text>
            <View style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: "2%",
            }}>
                <Text style={{
                    marginLeft: '5%',
                    color: '#030303',
                    fontSize: 18,
                    fontFamily: 'Montserrat-Regular'
                }}>Turn off all delivery organization</Text>

                <Switch value={checkedCount > 0 ? true : false}

                    color="#df8f17"
                    onValueChange={() => {
                        if (checkedCount > 0) {
                            store.dispatch(setOptionsOff())
                        } else {
                            Toast.show({
                                type: 'error',
                                text1: "Please choose one of the delivery organization",
                            })
                        }
                    }} />

            </View>
            {
                // store.dispatch(setOption())
                deliveryOptions.map(option => (
                    <TouchableWithoutFeedback key={option.name} onPress={() => { }}>
                        <View key={option.name} style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginLeft: '5%',
                        }}>
                            <TouchableWithoutFeedback onPress={() => {
                                setToggleModal({
                                    state: true,
                                    data: option.name
                                })
                            }}>
                                <Text style={{
                                    width: 110,
                                    marginBottom: '2%',
                                    color: 'white',
                                    fontSize: 16,
                                    fontFamily: 'Roboto-Regular',
                                    backgroundColor: "grey",
                                    borderRadius: 12,
                                    padding: 6,
                                    // textAlign: 'center'
                                }}>{option.name}</Text>
                            </TouchableWithoutFeedback>
                        </View>
                    </TouchableWithoutFeedback>
                ))
            }

            {toggleModal.state && <DeliverySettingsModal toggleModal={toggleModal} setToggleModal={setToggleModal} />}
        </ScrollView>
    )
}