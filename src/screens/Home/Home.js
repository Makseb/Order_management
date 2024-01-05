import React from 'react';
import { Header, Footer } from '../exports';
import { StyleSheet, View } from 'react-native';
import { Toast } from 'react-native-toast-message/lib/src/Toast';


export default function Home() {
    return (
        <View style={styles.container}>
            <Header />
            {/* showing toast for notifications */}
            <View style={{ zIndex: 9999 }}>
                <Toast />
            </View>

            <Footer />
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1
    }
})

