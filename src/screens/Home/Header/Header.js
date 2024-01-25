import React, { useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { Logo } from '../../../assets/images/exports';
import { ToggleSwitch } from '../../../Components/exports';
import { changeStoreStatus } from '../../../shared/slices/Auth/AuthService';
import { useSelector } from 'react-redux';
import { setStoreSelected } from '../../../shared/slices/Auth/AuthSlice';
import { store } from '../../../shared';
import { useTranslation } from 'react-i18next';

export default function Header() {
    const storeSelected = useSelector((state) => state.authentification.storeSelected.store)
    // console.log(storeSelected);
    const currency = useSelector((state) => state.authentification.storeSelected.currency)

    const { t: translation } = useTranslation();

    const toggleSwitch = () => {
        const updateStoreStatus = async () => {
            await changeStoreStatus({ _id: storeSelected._id, active: !storeSelected.active }, translation).then(res => {
                store.dispatch(setStoreSelected({ store: res.store, currency: currency }));
            }).catch(err => {
            })
        }
        updateStoreStatus()
    }
    return (
        <>
            <View style={styles.container}>

                <Image source={{ uri: storeSelected.logo }}
                    style={styles.image} />

                <View style={styles.containerSwitch}>
                    <ToggleSwitch isEnabled={storeSelected.active} toggleSwitch={toggleSwitch} />
                </View>
            </View>

        </>
    )
}
const styles = StyleSheet.create({
    container: {
        marginTop: '0.5%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '3%'
    },
    image: {
        marginLeft: '5%',
        width: 140, height: 70,
        resizeMode: "contain",
    },
    containerSwitch: {
        marginRight: '5%'
    }

})

