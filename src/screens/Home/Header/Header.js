import React, { useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { Logo } from '../../../assets/images/exports';
import { ToggleSwitch } from '../../../Components/exports';

export default function Header() {
    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => setIsEnabled(!isEnabled);

    return (
        <View style={styles.container}>
            <Image source={Logo} style={styles.image} />
            <View style={styles.containerSwitch}>
                <ToggleSwitch isEnabled={isEnabled} toggleSwitch={toggleSwitch} />
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom : '3%'
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

