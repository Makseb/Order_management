import { StyleSheet, TouchableOpacity, View, Text, TouchableWithoutFeedback } from "react-native";
import React from "react";
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

import { CommonActions, useNavigation } from '@react-navigation/native';

import { store } from "../../../shared";
import { disconnect } from "../../../shared/slices/Auth/AuthSlice";
import { Login } from "../../exports";
import { useTranslation } from "react-i18next";


export default function Settings() {
    const navigation = useNavigation()
    const { t: translation } = useTranslation();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                {translation("Settings")}
            </Text>
            <TouchableWithoutFeedback onPress={() => {
                navigation.navigate("Languages")
            }}>
                <View style={styles.containerIconAndText}>
                    <Icon name="globe" size={24} color={'#333'} />
                    <Text style={styles.textBesideIcon}>{translation("Languages")}</Text>
                </View>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback onPress={() => {
                navigation.navigate("Category")
            }}>
                <View style={styles.containerIconAndText}>
                    <MaterialIcons name="event-available" size={24} color={'#333'} />
                    <Text style={styles.textBesideIcon}>{translation("Availability")}</Text>
                </View>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback onPress={() => {
                navigation.navigate("PrintingSetting")
            }}>
                <View style={styles.containerIconAndText}>
                    <Icon name="print" size={24} color={'#333'} />
                    <Text style={styles.textBesideIcon}>{translation("Printing Settings")}</Text>
                </View>
            </TouchableWithoutFeedback>


            <TouchableWithoutFeedback onPress={() => {
                navigation.dispatch(
                    CommonActions.reset({
                        index: 0,
                        routes: [{ name: 'Login' }],
                    })
                );
                store.dispatch(disconnect())
            }}>
                <View style={[styles.containerIconAndText, { marginBottom: 0 }]}>
                    <Icon name="log-out" size={24} color={'#333'} />
                    <Text style={styles.textBesideIcon}>{translation("Logout")}</Text>
                </View>
            </TouchableWithoutFeedback>
        </View>
    );
}






const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    title: {
        marginLeft: '5%',
        marginBottom: '2%',
        color: '#030303',
        fontSize: 20,
        fontFamily: 'Montserrat-Regular'
    },
    containerIconAndText: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: '2%',
        // marginBottom: '3%',
        marginLeft: '5%',
    },
    textBesideIcon: {
        marginLeft: '1%',
        fontSize: 16,
        fontFamily: 'Roboto-Light',
        color: '#030303'
    }

})