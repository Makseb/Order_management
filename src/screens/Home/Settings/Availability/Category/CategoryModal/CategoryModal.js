import Modal from "react-native-modal";
import { View, Text, StyleSheet, TouchableWithoutFeedback } from "react-native"
import AntDesign from "react-native-vector-icons/AntDesign"
import { useState } from "react";

import { store } from "../../../../../../shared";
import { RadioButton } from "react-native-paper";
import { SelectList } from "react-native-dropdown-select-list";
import { updateCategoryAvailabiltyByMode } from "../../../../../../shared/slices/Availability/AvailabilityService";
import { useSelector } from "react-redux";
import { setCategories } from "../../../../../../shared/slices/Availability/AvailabilitySlice";
import Toast from "react-native-toast-message";

export default function CategoryModal({ modalProps }) {
    const { categorySelected, setCategorySelected } = modalProps
    // get modal of category selected 
    const category = useSelector((state) => state.availability.categories)[categorySelected.indexCategory]

    // get store selected
    const storeSelected = useSelector((state) => state.authentification.storeSelected._id)

    // const [checkMode, setCheckMode] = useState()
    const [checked, setChecked] = useState(null)

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
                <View style={styles.containerSelectList}>
                    <SelectList
                        defaultOption={{ key: category.availabilitys[0].mode._id, value: category.availabilitys[0].mode.name }}
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
                        setSelected={(val) => {
                            const availability = category.availabilitys.filter(availability => availability.mode._id === val);
                            availability[0].availability ? setChecked({
                                value: "available",
                                idMode: val
                            }) : setChecked({
                                value: "notavailable",
                                idMode: val
                            })
                        }}
                        data={category.availabilitys.map(item => ({ key: item.mode._id, value: item.mode.name }))}
                        save="key"
                    />
                </View>
                <Text style={styles.textOutOfStock}>Out of stock</Text>
                <View style={styles.containerRadioButton}>
                    <RadioButton.Item
                        label="Available"
                        value="available"
                        labelStyle={styles.radioButton}
                        status={checked?.value === 'available' ? 'checked' : 'unchecked'}
                        onPress={async () => {
                            const data = {
                                idMode: checked.idMode,
                                idCategory: category._id,
                                storeId: storeSelected,
                                value: true
                            }
                            const modifyCategoryAvailabiltyByMode = async (data) => {
                                await updateCategoryAvailabiltyByMode(data).then(res => {
                                    store.dispatch(setCategories({ categories: res.categories }))
                                }).catch(err => {
                                })
                            }
                            await modifyCategoryAvailabiltyByMode(data)
                            setChecked({
                                ...checked,
                                value: 'available'
                            })
                        }
                        }
                    />
                    <RadioButton.Item
                        label="Not available"
                        labelStyle={styles.radioButton}
                        value="notavailable"
                        status={checked?.value === 'notavailable' ? 'checked' : 'unchecked'}
                        onPress={async () => {
                            const data = {
                                idMode: checked.idMode,
                                idCategory: category._id,
                                storeId: storeSelected,
                                value: false
                            }
                            const modifyCategoryAvailabiltyByMode = async (data) => {
                                await updateCategoryAvailabiltyByMode(data).then(res => {
                                    store.dispatch(setCategories({ categories: res.categories }))
                                }).catch(err => {
                                })
                            }
                            await modifyCategoryAvailabiltyByMode(data)
                            setChecked({
                                ...checked,
                                value: 'notavailable'
                            })
                        }
                        }
                    />
                </View>
            </View>
            <Toast />
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
        color: '#030303',
    },
    containerSelectList: {
        width: '40%',
        zIndex: 2,
        position: 'absolute',
        top: -22,
    },
    textOutOfStock: {
        // marginTop : '5%',
        color: '#030303',
        fontFamily: 'Montserrat-Light',
        borderRadius: 24,
        fontSize: 16,
        lineHeight: 45,
    },
    containerRadioButton: {
        marginBottom: '5%',
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