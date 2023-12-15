import React from "react";
import { View } from "react-native";
import { List, Text } from 'react-native-paper';
import { useSelector } from "react-redux";

export default function ListSection({ listProps }) {
    const { order, expandeds, handlePress } = listProps;
    // get currency
    const currency = useSelector((state) => state.authentification.storeSelected.currency)

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
                                                                }}>{`    (+${option.price} ${currency})`}</Text>

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