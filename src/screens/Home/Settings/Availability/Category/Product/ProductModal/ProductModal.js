import { TouchableWithoutFeedback, View, Text, StyleSheet } from "react-native"
import { RadioButton } from "react-native-paper"
import { useSelector } from "react-redux"
import AntDesign from "react-native-vector-icons/AntDesign"
import { SelectList } from "react-native-dropdown-select-list"
import { useState } from "react"
import Toast from "react-native-toast-message"
import Modal from "react-native-modal";
import { updateProductAvailabiltyByMode } from "../../../../../../../shared/slices/Availability/AvailabilityService"
import { setProducts } from "../../../../../../../shared/slices/Availability/AvailabilitySlice"
import { store } from "../../../../../../../shared"

export default function ProductModal({ modalProps }) {
    const { productSelected, setProductSelected } = modalProps

    // get modal of product selected 
    const product = useSelector((state) => state.availability.products)[productSelected.indexProduct]

    // get store selected
    const storeSelected = useSelector((state) => state.authentification.storeSelected._id)

    // const [checkMode, setCheckMode] = useState()
    const [checked, setChecked] = useState(null)
    return (
        <Modal
            isVisible={productSelected.state}
            onBackdropPress={() => {
                setProductSelected({
                    ...productSelected,
                    state: false,
                })
            }}
            style={{ justifyContent: 'flex-end', margin: 0 }}>
            <View style={styles.container}>
                <TouchableWithoutFeedback onPress={() => {
                    setProductSelected({
                        ...productSelected,
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
                        defaultOption={{ key: product.availabilitys[0].mode._id, value: product.availabilitys[0].mode.name }}
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
                            const availability = product.availabilitys.filter(availability => availability.mode._id === val);
                            availability[0].availability ? setChecked({
                                value: "available",
                                idMode: val
                            }) : setChecked({
                                value: "notavailable",
                                idMode: val
                            })
                        }}
                        data={product.availabilitys.map(item => ({ key: item.mode._id, value: item.mode.name }))}
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
                                idCategory: product.category,
                                idMode: checked.idMode,
                                idProduct: product._id,
                                storeId: storeSelected,
                                value: true
                            }
                            const modifyProductAvailabiltyByMode = async (data) => {
                                await updateProductAvailabiltyByMode(data).then(res => {
                                    store.dispatch(setProducts({ products: res.products }))
                                }).catch(err => {
                                })
                            }
                            await modifyProductAvailabiltyByMode(data)
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
                                idProduct: product._id,
                                storeId: storeSelected,
                                value: false,
                                idCategory: product.category,
                            }
                            const modifyProductAvailabiltyByMode = async (data) => {
                                await updateProductAvailabiltyByMode(data).then(res => {
                                    store.dispatch(setProducts({ products: res.products }))
                                }).catch(err => {
                                })
                            }
                            await modifyProductAvailabiltyByMode(data)
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
        marginBottom: '10%',
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
