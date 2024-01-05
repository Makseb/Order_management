import { SelectList } from 'react-native-dropdown-select-list'
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import { getStoresNameAndIdByUserId } from '../../../shared/slices/Auth/AuthService';
import { store } from '../../../shared';
import { setNotificationId, setStoreSelected } from '../../../shared/slices/Auth/AuthSlice';

import { Logo } from '../../../assets/images/exports';

export default function SelectStore() {
    const userId = useSelector((state) => state.authentification.userId)
    const [selectedStore, setSelectedStore] = useState(null)

    const [stores, setStores] = useState(null)

    const navigation = useNavigation()

    useEffect(() => {
        const fetchStoresByUserId = async () => {
            await getStoresNameAndIdByUserId(userId).then(res => {
                setStores(res.stores)
            }).catch(err => {
            })
        }
        fetchStoresByUserId()
    }, [])

    return (
        stores &&
        (<View style={styles.container}>
            <Image source={Logo} style={styles.image} />
            <View style={styles.containerSelectListAndButton}>
                <View style={styles.containerSelectList}>
                    <SelectList
                        placeholder='store'
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
                        setSelected={(val) => setSelectedStore(val)}
                        data={stores.map(item => ({ key: item._id, value: item.name }))}
                        save="key"
                    />
                </View>

                <TouchableOpacity
                    style={styles.button}
                    onPress={
                        () => {
                            if (selectedStore) {
                                for (let i = 0; i < stores.length; i++) {
                                    if (stores[i]._id == selectedStore) {
                                        store.dispatch(setNotificationId({ notificationId: new Date().toString() }))
                                        store.dispatch(setStoreSelected(stores[i]))
                                        navigation.navigate('Home')
                                    }
                                }

                            }
                        }
                    }>
                    <Text style={styles.textButton}>Select</Text>
                </TouchableOpacity>
            </View>
        </View>)




    )
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '70%',
        resizeMode: "contain",
    },
    containerSelectListAndButton: {
        marginTop: '10%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    containerSelectList: {
        width: '60%',
        zIndex: 2,
        position: 'absolute',
        top: 0,
    },
    button: {
        // marginTop: '10.64%', // 6.64% (is the height of select cauz they are one above one) + (4% height i choosed between the button and the select like the page before)
        marginTop: '20%',
        width: '40%',
        height: 41,
        backgroundColor: '#df8f17',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 24,
        zIndex: 1,
    },
    textButton: {
        color: 'white',
        fontFamily: 'Montserrat-Regular',
        // fontWeight: 'bold',
        fontSize: 14
    }

})
