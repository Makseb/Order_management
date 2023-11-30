import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { getAllOrdersByStroreId } from "../../../shared/slices/Orders/OrdersService";
import { useSelector } from "react-redux";

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';

import Icon from 'react-native-vector-icons/Ionicons';

export default function Orders() {
    const storeSelected = useSelector((state) => state.authentification.storeSelected)
    useEffect(() => {

        // this function will get all the orders that was related to the store choosen from login step
        const fetchAllOrdersByStroreId = async () => {
            console.log(storeSelected);
            await getAllOrdersByStroreId(storeSelected).then(res => {
                // console.log(res.orders);
                // navigation.navigate('Home')
            }).catch(err => {

            })
        }

        fetchAllOrdersByStroreId()

    }, [])
    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                Orders
            </Text>

            <View style={{
                marginHorizontal: '5%',
                height: 39,
                flexDirection: 'row',
                justifyContent: 'center',
                shadowColor: 'rgba(0, 0, 0, 0.08)',
                shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowRadius: 4, // blur
                borderRadius: 8, // shadow soft
                // borderWidth : 1,

                shadowOpacity: 1,
                elevation: 4
            }}>
                <View style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                }}>
                    <MaterialIcons name="schedule" size={24} color={'#df8f17'} />
                    <Text style={{
                        fontSize: 14,
                        fontFamily: 'Montserrat-Light',
                        color: '#df8f17',
                        paddingLeft: '2%'
                    }}>Pending</Text>

                </View>

                <View style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                }}>
                    <View style={{
                        width: 2,
                        height: '50%',
                        backgroundColor: '#b7b7b7',
                    }}>
                    </View>
                    <FontAwesome6 name="spinner" size={24} color={'#b7b7b7'} style={{
                        paddingLeft: '3%'
                    }} />
                    <Text style={{
                        fontSize: 14,
                        fontFamily: 'Montserrat-Light',
                        color: '#b7b7b7',
                        paddingLeft: '2%'
                    }}>on progress</Text>

                </View>

                <View style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                }}>
                    <View style={{
                        width: 2,
                        height: '50%',
                        backgroundColor: '#b7b7b7',
                    }}>
                    </View>
                    <MaterialIcons name="check-circle-outline" size={24} color={'#b7b7b7'} style={{
                        paddingLeft: '3%'
                    }} />
                    <Text style={{
                        fontSize: 14,
                        fontFamily: 'Montserrat-Light',
                        color: '#b7b7b7',
                        paddingLeft: '2%'
                    }}>ready</Text>

                </View>
            </View>

            {/* partie thenya */}

            <View style={{
                marginTop: '5%'
            }}>
            </View>

            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginHorizontal: '5%',
                borderBottomColor: '#f0f0f0',
                borderBottomWidth: 2,
            }}>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <Icon name="bag-handle" size={40} color={'#333'} style={{
                        paddingRight: '1%',
                    }} />
                    <View style={{
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'flex-start',
                    }}>
                        <Text style={{
                            fontSize: 16,
                            fontFamily: 'Roboto-Regular',
                            color: '#030303'
                        }}>Jhon Doe</Text>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <MaterialIcons name='more-horiz' size={16} style={{
                                color: '#fc0'
                            }} />
                            <Text style={{
                                fontSize: 16,
                                fontFamily: 'Roboto-Regular',
                                color: '#fc0'
                            }}> Pending</Text>
                        </View>

                    </View>
                </View>

                <View style={{
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'flex-end',
                }}>
                    <Text style={{
                        fontSize: 14,
                        fontFamily: 'Montserrat-Light',
                        color: '#030303'
                    }}>21/12/2023</Text>
                    <Text style={{
                        fontSize: 14,
                        fontFamily: 'Montserrat-Light',
                        color: '#030303'
                    }}>09:45</Text>
                    <Text style={{
                        fontSize: 24,
                        fontFamily: 'Roboto-Bold',
                        color: '#030303'
                    }}>19.50€</Text>
                </View>

            </View>

            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginHorizontal: '5%',
                marginTop : '2%',
                borderBottomColor: '#f0f0f0',
                borderBottomWidth: 2,
            }}>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <Icon name="bag-handle" size={40} color={'#333'} style={{
                        paddingRight: '1%',
                    }} />
                    <View style={{
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'flex-start',
                    }}>
                        <Text style={{
                            fontSize: 16,
                            fontFamily: 'Roboto-Regular',
                            color: '#030303'
                        }}>Jhon Doe</Text>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <MaterialIcons name='done' size={16} style={{
                                color: '#5cd964'
                            }} />
                            <Text style={{
                                fontSize: 16,
                                fontFamily: 'Roboto-Regular',
                                color: '#5cd964'
                            }}> Accepted</Text>
                        </View>

                    </View>
                </View>

                <View style={{
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'flex-end',
                }}>
                    <Text style={{
                        fontSize: 14,
                        fontFamily: 'Montserrat-Light',
                        color: '#030303'
                    }}>21/12/2023</Text>
                    <Text style={{
                        fontSize: 14,
                        fontFamily: 'Montserrat-Light',
                        color: '#030303'
                    }}>09:45</Text>
                    <Text style={{
                        fontSize: 24,
                        fontFamily: 'Roboto-Bold',
                        color: '#030303'
                    }}>19.50€</Text>
                </View>

            </View>



        </View >
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    title: {
        marginLeft: '5%',
        marginBottom: '5%',
        color: '#030303',
        fontSize: 20,
        fontFamily: 'Montserrat-Regular'
    }
})