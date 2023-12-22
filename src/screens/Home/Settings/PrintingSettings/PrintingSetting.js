import { TouchableWithoutFeedback, View } from "react-native";
import { Text } from "react-native-paper";
import { Header, PrintingSettingsModal } from "../../../exports"
import AntDesign from "react-native-vector-icons/AntDesign";
import { useState } from "react";

export default function PrintingSetting() {
    const [toggleModal, setToggleModal] = useState(false)
    return (
        <View style={{
            flex: 1,
            backgroundColor: 'white'
        }}>
            <Header />
            <Text style={{
                marginLeft: '5%',
                marginBottom: '2%',
                color: '#030303',
                fontSize: 20,
                fontFamily: 'Montserrat-Regular'
            }}>Select</Text>
            <View style={{
                marginLeft: '5%',
            }}>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center'
                }}>
                    <AntDesign name="plus" size={20} color="black" />
                    <TouchableWithoutFeedback onPress={
                        () => setToggleModal(!toggleModal)
                    }>
                        <Text style={{
                            fontFamily: "Roboto-Light",
                            color: "black",
                            fontSize: 18,
                            marginLeft: '1%'
                        }}>Add printer(s)</Text>
                    </TouchableWithoutFeedback >
                </View>
            </View>
            {toggleModal && <PrintingSettingsModal modalProps={{ toggleModal, setToggleModal }} />}
        </View>
    )
}