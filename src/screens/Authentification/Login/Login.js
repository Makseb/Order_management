import { StyleSheet, TextInput, View, Pressable, Text, Image } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import Toast from "react-native-toast-message";

import { login } from '../../../shared/slices/Auth/AuthService';
import { Logo } from '../../../images/exports';
import { useForm } from "react-hook-form"


export default function Login() {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigation = useNavigation()
    // const { register, handleSubmit } = useForm()



    const submit = async (data) => {
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
            <View style={styles.container}>

                <Image source={Logo} style={styles.logo}
                />
                <Text style={styles.textEmailAndPassword}>Email</Text>
                <TextInput
                    onChangeText={(text) => setEmail(text)}
                    value={email}
                    placeholder="Type email"
                    autoComplete={'email'}
                    style={styles.inputEmailAndPassword}
                />
                <Text style={styles.textEmailAndPassword}>Password</Text>
                <TextInput

                    onChangeText={(text) => setPassword(text)}
                    value={password}
                    placeholder="Type password"
                    autoComplete={'password'}
                    secureTextEntry={true}
                    style={styles.inputEmailAndPassword}

                />
                <Text style={styles.forgotPassword}>Forgot password?</Text>
                <Pressable
                    style={styles.pressable}
                    onPress={() => submit()}>
                    <Text style={styles.textInsideLogin}>LOGIN</Text>
                </Pressable>
            </View>
            <Toast />


        </>
    );
}
const styles = StyleSheet.create({
    logo: {
        height: '25%', aspectRatio: 1, alignSelf: 'center', marginBottom: '10%'
    },
    container: {
        backgroundColor: 'white',
        flex: 1,
        flexDirection: 'column', // vertical
        justifyContent: 'center', // main axis column (it means y)
        // alignItems: 'center' // secondary axis (it means x for horizantal)
    },
    textEmailAndPassword: {
        letterSpacing: 0.25,
        
        marginLeft: '10%',
        marginRight: '10%',
        marginBottom: '3%',
        color: 'black'
    },
    inputEmailAndPassword: {
        borderColor: '#D8D8D8',
        borderWidth: 1,
        borderRadius: 8,

        paddingVertical: '3%',
        paddingLeft: 15,

        backgroundColor: '#F2F2F2',
        marginLeft: '10%',
        marginRight: '10%',
        marginBottom: '5%'
    },
    forgotPassword: {
        letterSpacing: 0.25,

        marginLeft: '10%',
        marginRight: '10%',

        marginBottom: '5%',
        color: '#ff5500',
    },
    pressable: {
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: '10%',
        marginLeft: '10%',
        paddingVertical: '4%',
        borderRadius: 4,
        backgroundColor: '#ff5500',
        marginBottom: '5%',
    },
    textInsideLogin: {
        letterSpacing: 0.25,
        fontSize: 20,
        color: 'white',
    },


})
