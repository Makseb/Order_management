import { StyleSheet, TextInput, View, Text, Image, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import React, { useState } from 'react';
import Toast from 'react-native-toast-message';

import { resetpassword } from '../../../shared/slices/Auth/AuthService';
import { Logo } from '../../../assets/images/exports';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

export default function ResetPassword({ route }) {
    const { t: translation } = useTranslation();

    const { params: { id, token } } = route;

    const [password, setPassword] = useState('')
    const [confimPassword, setConfimPassword] = useState('')
    const navigation = useNavigation()
    const [showToast, setShowToast] = useState(true)
    const submit = async () => {
        if (password.length >= 8 && (password === confimPassword)) {
            await resetpassword({ id: id, password }, token).then(res => {
                setShowToast(false)
                setPassword('')
                setConfimPassword('')
                navigation.goBack()
                if (res.message === "Password updated successfully.") {
                    Toast.show({
                        type: 'success',
                        text1: translation(res.message),
                    })
                }
            }).catch(err => {
                if (err.response.data.message === "Password already used.") {
                    Toast.show({
                        type: 'error',
                        text1: translation(err.response.data.message),
                    })
                }
            });
        } else if (password.length < 8) {
            Toast.show({
                type: 'error',
                text1: translation("Your password is too short."),
            });
        } else {
            Toast.show({
                type: 'error',
                text1: translation("Your password didn't match."),
            });
        }
    }
    return (
        <>
            {showToast && <Toast />}
            <View style={styles.container}>
                <Image source={Logo} style={styles.image} />

                <View style={styles.containerPasswordInput}>
                    <TextInput
                        style={styles.passwordInput}
                        value={password}
                        placeholder={translation("Password")}
                        onChangeText={e => setPassword(e)}
                        autoComplete={'password'}
                        secureTextEntry={true}
                        placeholderTextColor="#716D6D"
                    />
                </View>

                <View style={styles.containerConfirmPasswordInput}>
                    <TextInput
                        style={styles.passwordInput}
                        value={confimPassword}
                        placeholder={translation("Confirm Password")}
                        onChangeText={e => setConfimPassword(e)}
                        autoComplete={'password'}
                        secureTextEntry={true}
                        placeholderTextColor="#716D6D"
                    />
                </View>

                <View style={styles.containerButton}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => submit()}>
                        <Text style={styles.textButton}>{translation("Reset Password")}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </>
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
    containerPasswordInput: {
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
    containerConfirmPasswordInput: {
        width: '70%',
        marginTop: '2%',
        height: 55
    },
    passwordInput: {
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
    textForgotPassword: {
        alignSelf: 'flex-end',
        color: '#df8f17',
        fontFamily: 'Montserrat-Light',
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
