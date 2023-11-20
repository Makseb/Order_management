import { StyleSheet, TextInput, View, Pressable, Text } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message/';

import { login } from '../../../shared/slices/Auth/AuthService';

export default function Login() {

    const [email, setEmail] = useState('')
    console.log(email);
    const [password, setPassword] = useState('')
    const navigation = useNavigation()

    const submit = async () => {
        //console.log(email);
        if (email && password) {
            await login({ email, password }).then(res => {
                navigation.navigate('Home')
            }).catch(err => {
                // console.log(err.response?.data?.user_id)
                // if (err.response?.data?.user_id) {
                //     navigation.navigate('Verification', {
                //         user_id: err.response?.data?.user_id,
                //         isSignup: true,
                //     });
                // }
            });
        }
    }
    return (
        <>
            <Toast />
            <View style={styles.container}>
                <TextInput
                    onChangeText={(text) => setEmail(text)}
                    value={email}
                    placeholder="Email"
                    autoComplete={'email'}
                    style={styles.inputEmail}

                />
                <TextInput
                    onChangeText={(text) => setPassword(text)}
                    value={password}
                    placeholder="Password"
                    autoComplete={'password'}
                    secureTextEntry={true}
                    style={styles.inputPassword}
                />
                <Pressable
                    style={styles.pressable}
                    onPress={() => submit()}>
                    <Text style={styles.text}>LOGIN</Text>
                </Pressable>
                {/* <Pressable title='Login' onPress={() => submit()} /></Pressable> */}
            </View>


        </>
    );
}
const styles = StyleSheet.create({
    inputEmail: {
        // borderColor : 'black',
        // borderWidth : 1,
        backgroundColor: 'white',
        borderRadius: 8,
        paddingLeft: 15,
        marginLeft: '10%',
        marginRight: '10%',
        marginBottom: '5%'
    },
    inputPassword: {
        backgroundColor: 'white',
        borderRadius: 8,
        paddingLeft: 15,
        marginLeft: '10%',
        marginRight: '10%',
    },
    container: {
        //backgroundColor : 'white',
        top: '30%',
        bottom: '10%'
    },
    pressable: {
        marginTop: '10%',
        marginRight: '10%',
        marginLeft: '10%',
        alignItems: 'center', // Center horizantally
        justifyContent: 'center', // Center vertically
        paddingVertical: '2%',
        borderRadius: 4,
        backgroundColor: '#33a1f9',
    },
    text: {
        fontSize: 20,
        letterSpacing: 0.25,
        color: 'white',
    }


})
