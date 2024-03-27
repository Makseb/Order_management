import { StyleSheet, TextInput, View, Text, Image, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import React, { useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import Toast from "react-native-toast-message";

import { login } from '../../../shared/slices/Auth/AuthService';
import { Logo } from '../../../assets/images/exports';
import { useTranslation } from 'react-i18next';

export default function Login() {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigation = useNavigation()
    const { t: translation } = useTranslation();

    const submit = async () => {
        if (email && password) {
            await login({ email, password }, translation).then(res => {
                navigation.navigate('SelectStore')
                // res.user.stores > 1 ? navigation.navigate('Home') : navigation.navigate('SelectStore')
            }).catch(err => {
                console.log(err);
            });
        } else {
            Toast.show({
                type: 'error',
                text1: translation("Please type your e-mail and password."),
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

            <View style={{
                width: "70%",
                marginTop: '2%'
            }}>
                <TouchableWithoutFeedback onPress={() => navigation.navigate("ForgotPassword")}>
                    <Text style={styles.textForgotPassword}>{translation("Forgot password ?")}</Text>
                </TouchableWithoutFeedback>
            </View>

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

            <View style={styles.containerButton}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => submit()}>
                    <Text style={styles.textButton}>{translation("Login")}</Text>
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
    containerPasswordInput: {
        width: '70%',
        marginTop: '1%',
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
        fontSize: 12

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
