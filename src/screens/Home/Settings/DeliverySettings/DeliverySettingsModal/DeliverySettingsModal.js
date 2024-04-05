import Modal from "react-native-modal";
import { View, StyleSheet, TouchableWithoutFeedback } from "react-native"
import AntDesign from "react-native-vector-icons/AntDesign"
import { RadioButton } from "react-native-paper"
import { useTranslation } from "react-i18next";
import Toast from "react-native-toast-message";
import { store } from "../../../../../shared";
import { setOption } from "../../../../../shared/slices/Delivery/DeliverySlice";
import { useSelector } from "react-redux";

export default function DeliverySettingsModal({ toggleModal, setToggleModal }) {
    const { t: translation } = useTranslation();

    const organizations = useSelector((state) => state.delivery.organizations)
    const organizationIndex = organizations.findIndex(organization => organization.name === toggleModal.data)
    // console.log(organizations[organizationIndex]);
    return (

        <Modal
            isVisible={toggleModal.state}
            onBackdropPress={() => setToggleModal({
                state: false,
                data: undefined
            })}
            style={{ justifyContent: 'flex-end', margin: 0 }}>
            <Toast />
            <View
                style={styles.container}>
                <TouchableWithoutFeedback onPress={() => setToggleModal({
                    state: false,
                    data: undefined
                })}>
                    <AntDesign
                        style={styles.iconClock}
                        name="arrowleft"
                        size={20}
                    />
                </TouchableWithoutFeedback>
                <View style={{
                    flexDirection: 'row'
                }}>
                    {
                        organizations[organizationIndex].options.map(option => {
                            return (
                                <View key={option.name}>
                                    <RadioButton.Item
                                        color="#df8f17"
                                        label={option.name}
                                        value={option.name}
                                        labelStyle={styles.radioButton}
                                        status={option.checked ? 'checked' : 'unchecked'}
                                        onPress={() => {
                                            store.dispatch(setOption({ organization: toggleModal.data, state: option.name }))
                                        }}
                                    />
                                </View>)
                        })
                    }
                </View>
            </View>
        </Modal >

    )

}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
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
        color: '#030303'
    },
    radioButton: {
        color: '#030303',
        fontFamily: 'Montserrat-Light',
        borderRadius: 24,
        fontSize: 16,
        lineHeight: 45,
    }

})