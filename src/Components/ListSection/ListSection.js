import React, { useEffect, useState } from "react";
import { View } from "react-native";

import { List, Text } from 'react-native-paper';
import { useSelector } from "react-redux";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { PrintModal } from "../../screens/exports";
import { useTranslation } from "react-i18next";


export default function ListSection({ listProps }) {
    const { order, expandeds, handlePress } = listProps;
    // get currency
    const currency = useSelector((state) => state.authentification.storeSelected.currency)

    const [toggleModal, setToggleModal] = useState(false)
    const { t: translation } = useTranslation();

    return (
        <View>
            {/* call print modal */}
            {toggleModal && <PrintModal modalProps={{ toggleModal, setToggleModal, order }} />}
            {/* order detail */}
            <List.Section >
                {/* items detail */}
                <List.Accordion
                    expanded={expandeds[0]}
                    onPress={() => handlePress(0)}
                    descriptionStyle={{ fontFamily: 'Roboto-Light', fontSize: 12 }}
                    title={translation("Item details")} description={translation("Product, Options")} titleStyle={{ color: expandeds[0] ? "#df8f17" : "#7f7f7f", fontFamily: 'Robot-Regular' }}
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
                                setToggleModal(!toggleModal)
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
                            <List.Item title={`${translation("Total price")} : ${order.price_total} ${currency}`} titleStyle={{
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
                    title={translation("Client details")} description={translation("Phone, E-mail")} titleStyle={{ color: expandeds[1] ? "#df8f17" : "#7f7f7f", fontFamily: 'Robot-Regular' }}
                    left={props => <List.Icon {...props} icon="information" color={expandeds[1] ? "#df8f17" : "#7f7f7f"} />} rippleColor={"#df8f17"}
                    style={[
                        {
                            ...(!expandeds[1] && { borderBottomColor: '#7f7f7f', borderBottomWidth: 1 }),
                            backgroundColor: '#fafafa'
                        },
                    ]}>
                    <List.Item titleStyle={{ fontFamily: 'Roboto-Regular' }} title={`${translation("Phone")} : ${order.client_phone}`} />
                    <List.Item titleStyle={{ fontFamily: 'Roboto-Regular' }} title={`${translation("E-mail")} : ${order.client_email}`} />

                </List.Accordion>

                {/* Fulfillment */}
                <List.Accordion
                    expanded={expandeds[2]}
                    onPress={() => handlePress(2)}
                    descriptionStyle={{ fontFamily: 'Roboto-Light', fontSize: 12 }}
                    title={translation("Fulfillment")} description={translation("Mode, Reserved table, Source, Date and time, Address")} titleStyle={{ color: expandeds[2] ? "#df8f17" : "#7f7f7f", fontFamily: 'Roboto-Regular' }}
                    left={props => <List.Icon {...props} icon="check-circle" color={expandeds[2] ? "#df8f17" : "#7f7f7f"} />} rippleColor={"#df8f17"}
                    style={[
                        {
                            ...(!expandeds[2] && { borderBottomColor: '#7f7f7f', borderBottomWidth: 1 }),
                            backgroundColor: '#fafafa'
                        },
                    ]}>
                    <List.Item titleStyle={{ fontFamily: 'Roboto-Regular' }} title={`${translation("Created at")} : ${order.createdAt.date} ${order.createdAt.time}`} />
                    {order.status !== "pending" && <List.Item titleStyle={{ fontFamily: 'Roboto-Regular' }} title={`${translation("Last update")} : ${order.updatedAt.date} ${order.updatedAt.time}`} />}
                    {order.status !== "rejected" && <List.Item titleStyle={{ fontFamily: 'Roboto-Regular' }} title={`${translation("Prepared at")} : ${order.preparedAt ? `${order.preparedAt.date} ${order.preparedAt.time}` : "still not chosen by you"}`} />}
                    <List.Item titleStyle={{ fontFamily: 'Roboto-Regular' }} title={`${translation("Mode")} : ${order.type}`} />
                    <List.Item titleStyle={{ fontFamily: 'Roboto-Regular' }} title={`${translation("Reserved table")} : ${order.table}`} />
                    <List.Item titleStyle={{ fontFamily: 'Roboto-Regular' }} title={`${translation("Source")} : ${order.source}`} />
                    <List.Item titleStyle={{ fontFamily: 'Roboto-Regular' }} title={`${translation("Address")} : ${order.deliveryAdress}`} />

                </List.Accordion>
                {/* Payment */}
                <List.Accordion

                    expanded={expandeds[3]}
                    onPress={() => handlePress(3)}
                    descriptionStyle={{ fontFamily: 'Roboto-Light', fontSize: 12 }}
                    title={translation("Payment")} description={translation("Status, Method")} titleStyle={{ color: expandeds[3] ? "#df8f17" : "#7f7f7f", fontFamily: 'Roboto-Regular' }}
                    left={props => <List.Icon {...props} icon="cash" color={expandeds[3] ? "#df8f17" : "#7f7f7f"} />} rippleColor={"#df8f17"}
                    style={
                        {
                            backgroundColor: '#fafafa'
                        }
                    }>
                    <List.Item titleStyle={{ fontFamily: 'Roboto-Regular' }} title={`${translation("Status")} : `} />
                    <List.Item titleStyle={{ fontFamily: 'Roboto-Regular' }} title={`${translation("Method")} : `} />
                </List.Accordion>
            </List.Section>
        </View>
    )
}
