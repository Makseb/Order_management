import React, { useEffect, useState } from "react";
import { View } from "react-native";

import { List, Text } from 'react-native-paper';
import { useSelector } from "react-redux";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import ThermalPrinterModule from 'react-native-thermal-printer';
import escPosConvert from "../../utils/utils-function";


export default function ListSection({ listProps }) {
    const { order, expandeds, handlePress } = listProps;
    // get currency
    const currency = useSelector((state) => state.authentification.storeSelected.currency)
    const logoStore = useSelector((state) => state.authentification.storeSelected.logo)



    return (
        <View>
            {/* order detail */}
            <List.Section >
                {/* items detail */}
                <List.Accordion
                    expanded={expandeds[0]}
                    onPress={() => handlePress(0)}
                    descriptionStyle={{ fontFamily: 'Roboto-Light', fontSize: 12 }}
                    title="Item details" description="Product, Option group, Option" titleStyle={{ color: expandeds[0] ? "#df8f17" : "#7f7f7f", fontFamily: 'Robot-Regular' }}
                    left={props => <List.Icon {...props} icon="food" color={expandeds[0] ? "#df8f17" : "#7f7f7f"} />} rippleColor={"#df8f17"}
                    style={[
                        {
                            ...(!expandeds[0] && { borderBottomColor: '#7f7f7f', borderBottomWidth: 1 }),
                            backgroundColor: '#fafafa',
                        },
                    ]}>
                    <View style={{
                        flexDirection: 'column',
                        justifyContent: 'center',
                        paddingHorizontal: '10%'
                    }}>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between'
                        }}>
                            <View />
                            <MaterialCommunityIcons name="printer" size={30} color="#424242" onPress={async () => {
                                try {
                                    await ThermalPrinterModule.printTcp({
                                        ip: '192.168.1.192',
                                        port: 9100,
                                        payload: escPosConvert(order,currency,logoStore),
                                        timeout: 30000, // in milliseconds 
                                    });
                                } catch (err) {
                                    //error handling
                                    console.log(err.message);
                                }
                                // try {
                                //     const networkInfo = await LanPortScanner.getNetworkInfo();
                                //     console.log(networkInfo);
                                //     let k = 0
                                //     let tab = []
                                //     for (let i = 1; i <= 254; i++) {
                                //         setTimeout(async () => {
                                //             let result = await LanPortScanner.scanHost('192.168.1.' + i.toString(), 9100, 1000);
                                //             if (result && result.ip && result.port) {
                                //                 tab[k] = result
                                //                 k++
                                //             }
                                //         }, 1)
                                //     }
                                // } catch (err) {

                                // }
                                // console.log(tab);
                                // let config2 = {
                                //     ipRange: ipRange, //If you provide this params then it will only scan provided ipRange.
                                //     ports: [9100], //Specify port here
                                //     timeout: 1000, //Timeout for each thread in ms
                                //     threads: 150, //Number of threads
                                // };
                                // const cancelScanHandle = LanPortScanner.startScan(
                                //     config2, //or config2
                                //     (totalHosts, hostScanned) => {
                                //         // console.log(hostScanned / totalHosts); //Show progress
                                //     },
                                //     (result) => {
                                //         console.log(result); //This will call after new ip/port found.
                                //     },
                                //     (results) => {
                                //         // console.log(results); // This will call after scan end.
                                //     }
                                // );

                                // setTimeout(() => {
                                //     cancelScanHandle();
                                // }, 5000);

                            }} style={{
                                paddingTop: 8,
                                marginBottom: -10,
                                paddingRight: 24,
                            }} />
                        </View>
                        {
                            order.items.map((item, itemIndex) => (
                                <React.Fragment key={itemIndex}>
                                    <View style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}>
                                        <List.Item title={`${item.quantity}x ${item.name.charAt(0).toUpperCase() + item.name.slice(1)}`} titleStyle={{
                                            fontFamily: 'Roboto-Regular',
                                            fontSize: 20,
                                            color: '#424242',
                                        }} />
                                        <List.Item title={`${item.price} ${currency}`} titleStyle={{
                                            fontFamily: 'Roboto-Regular',
                                            fontSize: 16,
                                            color: '#424242',
                                            fontStyle: 'italic',
                                        }} />
                                    </View>
                                    {item.optionsGroup.map((optionGroup) => (
                                        <React.Fragment key={optionGroup.optionGroupeId}>
                                            <List.Item
                                                title={`${optionGroup.optionGroupeName.charAt(0).toUpperCase() + optionGroup.optionGroupeName.slice(1)}`}
                                                titleStyle={{
                                                    paddingLeft: 18,
                                                    fontFamily: 'Roboto-Light',
                                                    fontSize: 16,
                                                    color: '#7f7f7f',
                                                }}
                                                description={
                                                    <View>
                                                        {optionGroup.options.map((option, ind) => (
                                                            <View key={option._id} style={{
                                                                flexDirection: 'row',
                                                                justifyContent: 'space-between',
                                                                paddingLeft: 18,
                                                            }}>
                                                                <Text style={{
                                                                    fontFamily: 'Roboto-Regular',
                                                                    fontSize: 16,
                                                                    color: '#424242',
                                                                    fontStyle: 'italic',
                                                                }}>{`+${option.name.charAt(0).toUpperCase() + option.name.slice(1)}`}</Text>
                                                                <Text style={{
                                                                    fontFamily: 'Roboto-Regular',
                                                                    fontSize: 16,
                                                                    color: '#424242',
                                                                    fontStyle: 'italic',
                                                                    marginLeft: 10
                                                                }}>{`(+${option.price} ${currency})`}</Text>

                                                            </View>
                                                        ))}
                                                    </View>
                                                }
                                            />
                                        </React.Fragment>
                                    ))}
                                </React.Fragment>
                            ))
                        }
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between'
                        }}>
                            <Text></Text>
                            <List.Item title={`Total price : ${order.price_total} ${currency}`} titleStyle={{
                                fontFamily: 'Roboto-Regular',
                                fontSize: 20,
                                color: '#424242',
                                fontStyle: 'italic',
                            }} />
                        </View>

                    </View>


                </List.Accordion>

                {/* Client details */}
                <List.Accordion
                    expanded={expandeds[1]}
                    onPress={() => handlePress(1)}
                    descriptionStyle={{ fontFamily: 'Roboto-Light', fontSize: 12 }}
                    title="Client details" description="Phone, E-mail" titleStyle={{ color: expandeds[1] ? "#df8f17" : "#7f7f7f", fontFamily: 'Robot-Regular' }}
                    left={props => <List.Icon {...props} icon="information" color={expandeds[1] ? "#df8f17" : "#7f7f7f"} />} rippleColor={"#df8f17"}
                    style={[
                        {
                            ...(!expandeds[1] && { borderBottomColor: '#7f7f7f', borderBottomWidth: 1 }),
                            backgroundColor: '#fafafa'
                        },
                    ]}>
                    <List.Item titleStyle={{ fontFamily: 'Roboto-Regular' }} title={`Phone : ${order.client_phone}`} />
                    <List.Item titleStyle={{ fontFamily: 'Roboto-Regular' }} title={`Email : ${order.client_email}`} />

                </List.Accordion>

                {/* Fulfillment */}
                <List.Accordion
                    expanded={expandeds[2]}
                    onPress={() => handlePress(2)}
                    descriptionStyle={{ fontFamily: 'Roboto-Light', fontSize: 12 }}
                    title="Fulfillment" description="Mode, Reserved table, Source, Date and time, Address" titleStyle={{ color: expandeds[2] ? "#df8f17" : "#7f7f7f", fontFamily: 'Roboto-Regular' }}
                    left={props => <List.Icon {...props} icon="check-circle" color={expandeds[2] ? "#df8f17" : "#7f7f7f"} />} rippleColor={"#df8f17"}
                    style={[
                        {
                            ...(!expandeds[2] && { borderBottomColor: '#7f7f7f', borderBottomWidth: 1 }),
                            backgroundColor: '#fafafa'
                        },
                    ]}>
                    <List.Item titleStyle={{ fontFamily: 'Roboto-Regular' }} title={`Created at : ${order.createdAt.date} ${order.createdAt.time}`} />
                    {order.status !== "pending" && <List.Item titleStyle={{ fontFamily: 'Roboto-Regular' }} title={`Last update : ${order.updatedAt.date} ${order.updatedAt.time}`} />}
                    {order.status !== "rejected" && <List.Item titleStyle={{ fontFamily: 'Roboto-Regular' }} title={`Prepared at : ${order.preparedAt ? `${order.preparedAt.date} ${order.preparedAt.time}` : "still not chosen by you"}`} />}
                    <List.Item titleStyle={{ fontFamily: 'Roboto-Regular' }} title={`Mode : ${order.type}`} />
                    <List.Item titleStyle={{ fontFamily: 'Roboto-Regular' }} title={`Reserved table : ${order.table}`} />
                    <List.Item titleStyle={{ fontFamily: 'Roboto-Regular' }} title={`Source : ${order.source}`} />
                    <List.Item titleStyle={{ fontFamily: 'Roboto-Regular' }} title={`Address : ${order.deliveryAdress}`} />

                </List.Accordion>
                {/* Payment */}
                <List.Accordion

                    expanded={expandeds[3]}
                    onPress={() => handlePress(3)}
                    descriptionStyle={{ fontFamily: 'Roboto-Light', fontSize: 12 }}
                    title="Payment" description="Status, Method" titleStyle={{ color: expandeds[3] ? "#df8f17" : "#7f7f7f", fontFamily: 'Roboto-Regular' }}
                    left={props => <List.Icon {...props} icon="cash" color={expandeds[3] ? "#df8f17" : "#7f7f7f"} />} rippleColor={"#df8f17"}
                    style={
                        {
                            backgroundColor: '#fafafa'
                        }
                    }>
                    <List.Item titleStyle={{ fontFamily: 'Roboto-Regular' }} title={`Status : `} />
                    <List.Item titleStyle={{ fontFamily: 'Roboto-Regular' }} title={`Method : `} />
                </List.Accordion>
            </List.Section>
        </View>
    )
}
function test() {

    const App = () => {
        const [devices, setDevices] = useState([]);

        useEffect(() => {
            const scanLocalNetwork = async () => {
                try {
                    const results = await NetworkScanner.scan();
                    const devicesWithHostnames = await Promise.all(
                        results.map(async (device) => {
                            try {
                                const hostname = await DnsLookup.lookup(device.ip);
                                return { ...device, hostname };
                            } catch (error) {
                                // Handle DNS lookup error
                                console.error(`Failed to get hostname for ${device.ip}`, error);
                                return device;
                            }
                        })
                    );
                    setDevices(devicesWithHostnames);
                } catch (error) {
                    // Handle network scanning error
                    console.error("Network scanning failed", error);
                }
            };

            scanLocalNetwork();
        }, []);

        return (
            <View>
                <Text>Devices on the local network:</Text>
                {devices.map((device) => (
                    <Text key={device.ip}>{`${device.hostname || device.ip}`}</Text>
                ))}
            </View>
        );
    };
}