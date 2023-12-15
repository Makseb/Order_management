import Modal from "react-native-modal";
import { View, Text, StyleSheet, TextInput, TouchableWithoutFeedback, TouchableOpacity } from "react-native"
import AntDesign from "react-native-vector-icons/AntDesign"
import { useEffect, useState } from "react";
import { updateState } from "../../../../../shared/slices/Orders/OrdersSlice";
import { updateOrderStatus } from "../../../../../shared/slices/Orders/OrdersService";
import { store } from "../../../../../shared";
import { RadioButton } from "react-native-paper";
import { SelectList } from "react-native-dropdown-select-list";

export default function AvailabilityModal({ modalProps }) {
    const { categorySelected, setCategorySelected } = modalProps
    const [checkMode, setCheckedMode] = useState()
    const [checked, setChecked] = useState()

    // useEffect(() => {
    //     const fetchAllModeByCategory = async () => {
    //         await getAllCategoriesByStoreId(storeSelected).then(res => {
    //             store.dispatch(setCategories({ categories: res.categories }))
    //         }).catch(err => {
    //         })
    //     }
    //     fetchAllModeByCategory()
    // }, [])

    return (
        <Modal
            isVisible={categorySelected.state}
            onBackdropPress={() => {
                setCategorySelected({
                    ...categorySelected,
                    state: false,
                })
            }}
            style={{ justifyContent: 'flex-end', margin: 0 }}>
            <View style={styles.container}>
                <TouchableWithoutFeedback onPress={() => {
                    setCategorySelected({
                        ...categorySelected,
                        state: false,
                    })
                }}>
                    <AntDesign
                        style={styles.iconClock}
                        name="arrowleft"
                        size={20}
                    />
                </TouchableWithoutFeedback>
                {/* <Text style={{
                    marginBottom: '1%',
                    color: '#030303',
                    fontFamily: 'Montserrat-Light',
                    borderRadius: 24,
                    fontSize: 16,
                    lineHeight: 45,
                }}>Out of stock</Text> */}
                <View style={{
                    width: '40%',
                    zIndex: 2,
                    position: 'absolute',
                    top: 0,
                }}>
                    <SelectList
                        placeholder='Select mode'
                        boxStyles={{
                            display: 'flex',
                            alignItems: 'center',
                            height: 51,
                            borderRadius: 24,
                            backgroundColor: 'white',
                            borderColor: '#ddd',
                        }}
                        dropdownStyles={{
                            borderRadius: 24,
                            backgroundColor: 'white',
                            borderColor: '#ddd',

                        }}
                        dropdownTextStyles={{
                            color: '#202020',
                            fontFamily: 'Montserrat-Light',
                            fontSize: 16
                        }}
                        inputStyles={{
                            fontFamily: 'Montserrat-Light',
                            fontSize: 16,
                            color: '#202020'
                        }}
                        setSelected={(val) => setCheckedMode(val)}
                        data={categorySelected.category.availabilitys.map(item => ({ key: item._id, value: item.mode }))}
                        save="key"
                    />
                </View>
                <View style={{
                    marginBottom: '3%',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <RadioButton.Item
                        label="Available"
                        value="first"
                        labelStyle={{
                            color: '#030303',
                            fontFamily: 'Montserrat-Light',
                            borderRadius: 24,
                            fontSize: 16,
                            lineHeight: 45,
                        }}
                        status={checked === 'first' ? 'checked' : 'unchecked'}
                        onPress={() => setChecked('first')}
                    />
                    <RadioButton.Item
                        label="Not available"
                        labelStyle={{
                            color: '#030303',
                            fontFamily: 'Montserrat-Light',
                            borderRadius: 24,
                            fontSize: 16,
                            lineHeight: 45,
                        }}
                        value="second"
                        status={checked === 'second' ? 'checked' : 'unchecked'}
                        onPress={() => setChecked('second')}
                    />
                </View>
            </View>
        </Modal >
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
        color: '#030303'
    },
    text: {
        color: '#030303',
        fontFamily: 'Montserrat-Light',
        fontSize: 14,
        marginBottom: '1%'
    },
    inputContainer: {
        width: '20%',
        height: 45,
        flexDirection: 'row',
        alignItems: 'center',
    },
    containerPreparation: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    textPreparation: {
        backgroundColor: '#F7F7F7',
        color: '#030303',
        fontFamily: 'Montserrat-Light',
        borderRadius: 24,
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 45,
        width: '22%',
    },
    input: {
        backgroundColor: 'white',
        color: '#030303',
        justifyContent: 'center',
        fontFamily: 'Montserrat-Light',
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 24,
        textAlign: 'center',
        fontSize: 14,
        flex: 1,
        height: 40,
    },
    acceptContainer: {
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: '3%'
    },
    acceptButton: {
        height: 45,
        width: '30%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#5cd964',
        borderRadius: 22,
    },
    textAcceptButton: {
        color: 'white',
        fontFamily: 'Montserrat-Regular',
        fontSize: 18,
    },
})