import { StyleSheet, TouchableOpacity, View, Text, TouchableWithoutFeedback } from "react-native";
import React from "react";
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

import { useNavigation } from '@react-navigation/native';

import { store } from "../../../shared";
import { disconnect } from "../../../shared/slices/Auth/AuthSlice";
import { useSelector } from "react-redux";



export default function Settings() {
    const navigation = useNavigation()

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                Settings
            </Text>
            <View style={styles.containerIconAndText}>
                <Icon name="globe" size={24} color={'#333'} />
                <Text style={styles.textBesideIcon}>Languages</Text>
            </View>

            <TouchableWithoutFeedback onPress={() => {
                navigation.navigate("Availability")
            }}>
                <View style={styles.containerIconAndText}>
                    <MaterialIcons name="event-available" size={24} color={'#333'} />
                    <Text style={styles.textBesideIcon}>Availability</Text>
                </View>
            </TouchableWithoutFeedback>

            <View style={styles.containerIconAndText}>
                <Icon name="print" size={24} color={'#333'} />
                <Text style={styles.textBesideIcon}>Printing Settings</Text>
            </View>

            <TouchableWithoutFeedback onPress={() => {
                navigation.navigate("Login")
            }}>
                <View style={[styles.containerIconAndText, { marginBottom: 0 }]}>
                    <Icon name="log-out" size={24} color={'#333'} />
                    <Text style={styles.textBesideIcon}>Logout</Text>
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
        marginLeft: '5%',
    },
    textBesideIcon: {
        marginLeft: '1%',
        fontSize: 16,
        fontFamily: 'Roboto-Light',
        color: '#030303'
    }

})