import { StyleSheet, TextInput, View, Text, Image, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message/';

import { login } from '../../../shared/slices/Auth/AuthService';
import { Logo } from '../../../assets/images/exports';

export default function Login() {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigation = useNavigation()

    const submit = async () => {
        console.log(email);
        console.log(password);
        if (email && password) {
            await login({ email, password }).then(res => {
                res.user.stores > 1 ? navigation.navigate('SelectStore') : navigation.navigate('SelectStore')
            }).catch(err => {
            });
        }
    }
    return (
        <>
            <View style={styles.container}>
                <Image source={Logo} style={styles.image} />

                <View style={styles.containerEmailInput}>
                    <TextInput
                        style={styles.emailInput}
                        placeholder="E-mail"
                        autoComplete={'email'}
                        onChangeText={e => setEmail(e)}
                        placeholderTextColor="#716D6D"
                        value={email}
                    />
                </View>

                <View style={styles.containerPasswordInput}>
                    <TextInput
                        style={styles.passwordInput}
                        value={password}
                        placeholder="Password"
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
                        <Text style={styles.textButton}>Login</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <Toast />

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
