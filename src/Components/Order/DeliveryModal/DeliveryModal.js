
import Modal from "react-native-modal";
import { View, Text, StyleSheet, TouchableWithoutFeedback, TouchableOpacity, ScrollView, Image } from "react-native"
import AntDesign from "react-native-vector-icons/AntDesign"
import { store } from "../../../shared/index";
import Toast from "react-native-toast-message";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useState } from "react";
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { resetUber } from "../../../shared/slices/Delivery/DeliverySlice";
import { UberDelivery } from "./../../exports"
import { useSelector } from "react-redux";


export default function DeliveryModal({ toggleModal, setToggleModal }) {

    const organizations = useSelector((state) => state.delivery.organizations)
    const indexOfCheckedOrganization = organizations.findIndex((org) =>
        org.options.some((option) => option.checked)
    );

    return (
        <Modal
            isVisible={toggleModal.state}
            onBackdropPress={() => {
                setToggleModal({
                    state: false,
                    orderId: undefined
                })
                store.dispatch(resetUber())
                // console.log("disconnect");
                // disconnectSocket()
            }
            }
            style={{ justifyContent: 'flex-end', margin: 0 }}>
            <Toast />
            <View
                style={styles.container}>
                <TouchableWithoutFeedback onPress={() => {
                    setToggleModal({
                        state: false,
                        orderId: undefined
                    })
                    store.dispatch(resetUber())
                    // disconnectSocket()
                }
                }>
                    <AntDesign
                        style={styles.iconClock}
                        name="arrowleft"
                        size={20}
                    />
                </TouchableWithoutFeedback>
            </View>
            <View style={styles.containerTitle}>

                <Text style={styles.title}>
                    {"Delivery"}
                </Text>
                {/* show toast if notification arrive */}
                <View style={{ overflow: 'hidden' }}>
                    <View style={styles.containerHeader}>
                        {
                            organizations.map((organization, index) => {
                                return (<>
                                    <View style={[styles.containerAll,
                                    ]}>
                                        <MaterialIcons name="schedule" size={24} color={organizations[indexOfCheckedOrganization].name === organization.name ? '#5cd964' : '#b7b7b7'} />
                                        <Text style={[styles.headerText, { color: organizations[indexOfCheckedOrganization].name === organization.name ? '#5cd964' : '#b7b7b7' }]}>{organization.name}</Text>
                                    </View>
                                    {
                                        index !== organizations.length - 1 && <View style={{
                                            justifyContent: 'center',
                                        }}>
                                            <View style={styles.barrHeader} />
                                        </View>
                                    }
                                </>)
                            })
                        }
                    </View>
                    {organizations[indexOfCheckedOrganization].name === "Uber direct" && <UberDelivery toggleModal={toggleModal} />}
                </View >
            </View>
        </Modal >
    )

}

const styles = StyleSheet.create({
    container: {
        // flex : 1,
        flexDirection: 'column',
        backgroundColor: 'white',
        alignItems: 'center',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        // height: 500
    },
    iconClock: {
        alignSelf: 'flex-start',
        paddingTop: '1.5%',
        paddingLeft: '1.5%',
        fontFamily: 'Montserrat-Light',
        color: '#030303'
    },
    containerTitle: {
        flex: 0.6,
        backgroundColor: 'white',
    },
    title: {
        marginLeft: '5%',
        marginBottom: '2%',
        color: '#030303',
        fontSize: 20,
        fontFamily: 'Montserrat-Regular'
    },
    shadowHeader: {
        overflow: 'hidden',
        marginHorizontal: '5%',
        paddingBottom: '1%', //shadow bottom 
        // paddingRight: '0.1%', // shadow right
        // THIS STYLE FOR SHADOW BOTTOM AND RIGHT
    },
    containerHeader: {
        // marginBottom : 1, // 
        marginHorizontal: '5%',
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'center',
        height: 49,
        shadowColor: "#030303",
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 6,
        shadowOpacity: 0.8,
        elevation: 3,
    },
    containerAll: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    headerText: {
        fontSize: 14,
        fontFamily: 'Montserrat-Light',
        color: '#b7b7b7',
        paddingLeft: '2%'
    },
    containerInProgress: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    barrHeader: {
        width: 2,
        height: '50%',
        backgroundColor: '#b7b7b7',
    },
    containerReady: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
})
