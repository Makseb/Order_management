import React, { useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { Logo } from '../../../assets/images/exports';
import { ToggleSwitch } from '../../../Components/exports';
import { changeStoreStatus } from '../../../shared/slices/Auth/AuthService';
import { useSelector } from 'react-redux';
import { setStoreSelected } from '../../../shared/slices/Auth/AuthSlice';
import { store } from '../../../shared';
import Toast from 'react-native-toast-message';

export default function Header() {
    const storeSelected = useSelector((state) => state.authentification.storeSelected)

    const toggleSwitch = () => {
        const updateStoreStatus = async () => {
            await changeStoreStatus({ _id: storeSelected._id, active: !storeSelected.active }).then(res => {
                store.dispatch(setStoreSelected(res.store));
            }).catch(err => {
            })
        }
        updateStoreStatus()
    }
    return (
        <View style={styles.container}>
            <Image source={Logo} style={styles.image} />
            <View style={styles.containerSwitch}>
                <ToggleSwitch isEnabled={storeSelected.active} toggleSwitch={toggleSwitch} />
            </View>
            <Toast />
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '3%'
    },
    image: {
        marginLeft: '5%',
        width: '30%',
        resizeMode: "contain",
    },
    containerSwitch: {
        marginRight: '5%'
    }

})

