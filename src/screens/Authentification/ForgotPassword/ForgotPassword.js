import { StyleSheet, TextInput, View, Text, Image, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import React, { useState } from 'react';
import Toast from "react-native-toast-message";

import { Logo } from '../../../assets/images/exports';
import { forgotpassword } from '../../../shared/slices/Auth/AuthService';
import { useTranslation } from 'react-i18next';

export default function ForgotPassword() {
    const [email, setEmail] = useState('')
    const { t: translation } = useTranslation();

    const submit = async () => {
        if (email) {
            await forgotpassword({ email }, translation).then(res => {
                setEmail('')
            }).catch(err => {
                if (err.response.data.message === "Error in sending e-mail." || err.response.data.message === "Email not found.") {
                    Toast.show({
                        type: 'error',
                        text1: translation(err.response.data.message),
                    })
                }
            });
        } else {
            Toast.show({
                type: 'error',
                text1: translation("Please type your e-mail."),
            });
        }
    }

    return (
        <View style={styles.container}>
            <Image source={Logo} style={styles.image} />

            <View style={styles.containerEmailInput}>
                <TextInput
                    style={styles.emailInput}
                    placeholder={translation("E-mail")}
                    autoComplete={'email'}
                    onChangeText={e => setEmail(e)}
                    placeholderTextColor="#716D6D"
                    value={email}
                />
            </View>

            <View style={styles.containerButton}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => submit()}>
                    <Text style={styles.textButton}>{translation("Forgot password")}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    image: {
        width: '70%',
        resizeMode: "contain"
    },
    containerEmailInput: {
        width: '70%',
        height: 55,
        marginTop: '10%'
    },
    emailInput: {
        backgroundColor: 'white',
        color: '#7f7f7f',
        justifyContent: 'center',
        fontFamily: 'Montserrat-Light',
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 24,
        textAlign: 'center',
        fontSize: 14
    },
    containerButton: {
        width: '70%',
        marginTop: '4%'
    },
    button: {
        backgroundColor: '#df8f17',
        borderRadius: 24,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 55
    },
    textButton: {
        fontFamily: 'Montserrat-Regular', // here it should be with font family font weight bold, i use Montserrat-Regular instead of Montserrat-Light to be bold...
        //fontWeight: 'bold',
        color: 'white',
        fontSize: 18,
    }
});
