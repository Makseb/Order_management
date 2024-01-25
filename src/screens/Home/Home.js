import React from 'react';
import { Header, Footer } from '../exports';
import { StyleSheet, View } from 'react-native';


export default function Home() {
    return (
        <>
            {/* showing toast for notifications */}
            <View style={styles.container}>
                <Header />
                <Footer />
            </View>

        </>
    );
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1
    }
})

