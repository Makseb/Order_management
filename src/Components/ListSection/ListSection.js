import React, { useState } from "react";
import { View } from "react-native";

import { List, Text } from 'react-native-paper';
import { useSelector } from "react-redux";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { PrintModal } from "../../screens/exports";
import { useTranslation } from "react-i18next";
import Ionicons from 'react-native-vector-icons/Ionicons';


export default function ListSection({ listProps }) {
    const { order, expandeds, handlePress } = listProps;
    // get currency
    const currency = useSelector((state) => state.authentification.storeSelected.currency)

    const [toggleModal, setToggleModal] = useState(false)
    const { t: translation } = useTranslation();

    // console.log("order", order);
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
                            <MaterialCommunityIcons name="printer" size={35} color="#424242" onPress={async () => {
                                setToggleModal(!toggleModal)
                            }} style={{
                                // backgroundColor  :"red",
                                paddingTop: 8,
                                marginBottom: -10, // without shadow -10
                                marginRight: 24,
                            }} />
                        </View>
                        {/* promo */}
                        {
                            order.promo.map((promo, i) => (
                                <View key={promo.promo._id}>
                                    <List.Item title={`${promo.promo.name.charAt(0).toUpperCase() + promo.promo.name.slice(1)}`} titleStyle={{
                                        fontFamily: 'Roboto-BoldItalic',
                                        fontSize: 20,
                                        color: '#424242',
                                        textAlign: "center",
                                        // fontStyle: "italic"
                                    }} />
                                    {promo.items.map((item, itemIndex) => (

                                        <React.Fragment key={itemIndex}>
                                            <View style={{
                                                flexDirection: 'row',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                            }}>
                                                <List.Item title={`${item.quantity}x ${item.name.charAt(0).toUpperCase() + item.name.slice(1)} ${item.size !== "S" ? `(${item.size})` : ""}`} titleStyle={{
                                                    fontFamily: 'Roboto-Regular',
                                                    fontSize: 20,
                                                    color: '#424242',
                                                }} />

                                                <View style={{
                                                    flexDirection: "row",
                                                    // justifyContent  : "center",
                                                    // alignItems : "center"
                                                }}>
                                                    {/* <Text style={{
                                                        fontFamily: 'Roboto-Regular',
                                                        fontSize: 16,
                                                        color: '#424242',
                                                        fontStyle: 'italic',
                                                        textDecorationLine: item.price_after_discount === item.item_price ? "none" : "line-through",
                                                        marginLeft : item.price_after_discount !== item.item_price && -10
                                                    }}>{item.item_price} {currency}</Text>
                                                    {item.price_after_discount !== item.item_price &&
                                                        <Text style={{
                                                            fontFamily: 'Roboto-Regular',
                                                            fontSize: 16,
                                                            color: '#424242',
                                                            fontStyle: 'italic',
                                                            marginLeft : item.price_after_discount !== item.item_price && 10

                                                        }} >
                                                            {item.price_after_discount === 0 ? translation("Free") : `${item.price_after_discount} ${currency}`}
                                                        </Text>} */}

                                                    <List.Item title={
                                                        `${item.item_price} ${currency}`
                                                    } titleStyle={{
                                                        fontFamily: 'Roboto-Regular',
                                                        fontSize: 16,
                                                        color: '#424242',
                                                        fontStyle: 'italic',
                                                        textDecorationLine: item.price_after_discount === item.item_price ? "none" : "line-through"
                                                    }} />

                                                    {item.price_after_discount !== item.item_price && <List.Item title={
                                                        `${item.price_after_discount === 0 ? translation("Free") : `${item.price_after_discount} ${currency}`}`
                                                    } titleStyle={{
                                                        fontFamily: 'Roboto-Regular',
                                                        fontSize: 16,
                                                        color: '#424242',
                                                        fontStyle: 'italic',
                                                    }} />}

                                                </View>

                                            </View>
                                            {/* {console.log("item.optionsGrou", item.optionsGroup)} */}

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
                                                                        flexDirection: "column",
                                                                    }}>
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
                                                                            }}>{`+${option.quantity}x ${option.name.charAt(0).toUpperCase() + option.name.slice(1)}`}</Text>
                                                                            <Text style={{
                                                                                fontFamily: 'Roboto-Regular',
                                                                                fontSize: 16,
                                                                                color: '#424242',
                                                                                fontStyle: 'italic',
                                                                                marginLeft: 10
                                                                            }}>{`(+${option.price_opt} ${currency})`}</Text>

                                                                        </View>
                                                                        <View style={{
                                                                            display: "flex",
                                                                            flexDirection: 'column',
                                                                            paddingLeft: 18
                                                                        }}>
                                                                            {
                                                                                option.options.map((opt) => (
                                                                                    <View key={opt._id} style={{
                                                                                        flexDirection: 'row',
                                                                                        marginLeft: 18
                                                                                    }}>
                                                                                        <Text style={{
                                                                                            fontFamily: 'QuickSand',
                                                                                            fontSize: 16,
                                                                                            color: '#424242',
                                                                                            fontStyle: 'italic',
                                                                                        }}>+{opt.quantity}x {opt.name}</Text>
                                                                                        <Text style={{
                                                                                            fontFamily: 'QuickSand',
                                                                                            fontSize: 16,
                                                                                            color: '#424242',
                                                                                            fontStyle: 'italic',
                                                                                            marginLeft: 10
                                                                                        }}>(+{opt.price} {currency})</Text>
                                                                                    </View>
                                                                                ))
                                                                            }
                                                                        </View>
                                                                    </View>
                                                                ))}
                                                            </View>
                                                        }
                                                    />
                                                </React.Fragment>
                                            ))}

                                            {item.note && <List.Item
                                                titleStyle={
                                                    {
                                                        marginTop: 20,
                                                        marginBottom: 10,
                                                        width: "100%",
                                                        backgroundColor: "#F7E4C6",
                                                        padding: 10,
                                                        borderRadius: 10,
                                                    }
                                                }
                                                title={
                                                    <View style={{
                                                        justifyContent: "flex-start",
                                                        alignItems: "center",
                                                        flexDirection: "row",
                                                    }}>
                                                        <Ionicons name="information-circle-outline" style={{ color: "#D2691E", fontSize: 20, marginRight: 5 }} />
                                                        <Text style={{ color: "#D2691E", fontSize: 13 }}>Note: {item.note}</Text>
                                                    </View>
                                                }
                                            />}
                                            <List.Item title={
                                                `${translation("Subtotal")} : ${item.subtotal} ${currency}`
                                            } titleStyle={{
                                                alignSelf: "flex-end",
                                                fontFamily: 'Roboto-BoldItalic',
                                                fontSize: 16,
                                                color: '#424242',
                                                // fontStyle: 'italic',
                                            }} />
                                            {/* <View style={{borderBottomColor: 'black',borderBottomWidth: 0.5,}}></View> */}
                                        </React.Fragment>
                                    ))}
                                </View>
                            ))
                        }
                        {order.items.length > 0 && order.promo.length > 0 && <List.Item title={`${translation("Non-Promotional Products")}`} titleStyle={{
                            fontFamily: 'Roboto-BoldItalic',
                            fontSize: 20,
                            color: '#424242',
                            textAlign: "center",
                            // fontStyle: "italic"
                        }} />}

                        {/* items */}
                        {
                            order.items.map((item, itemIndex) => (
                                <React.Fragment key={itemIndex}>
                                    <View style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}>
                                        <List.Item title={`${item.quantity}x ${item.name.charAt(0).toUpperCase() + item.name.slice(1)} ${item.size !== "S" ? `(${item.size})` : ""}`} titleStyle={{
                                            fontFamily: 'Roboto-Regular',
                                            fontSize: 20,
                                            color: '#424242',
                                        }} />
                                        {console.log(item)}
                                        <List.Item title={`${item.item_price} ${currency}`} titleStyle={{
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
                                                                flexDirection: "column",
                                                            }}>
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
                                                                    }}>{`+${option.quantity}x ${option.name.charAt(0).toUpperCase() + option.name.slice(1)}`}</Text>
                                                                    <Text style={{
                                                                        fontFamily: 'Roboto-Regular',
                                                                        fontSize: 16,
                                                                        color: '#424242',
                                                                        fontStyle: 'italic',
                                                                        marginLeft: 10
                                                                    }}>{`(+${option.price_opt} ${currency})`}</Text>

                                                                </View>
                                                                <View style={{
                                                                    display: "flex",
                                                                    flexDirection: 'column',
                                                                    paddingLeft: 18
                                                                }}>
                                                                    {
                                                                        option.options.map((opt) => (
                                                                            <View key={opt._id} style={{
                                                                                flexDirection: 'row',
                                                                                paddingLeft: 18
                                                                            }}>
                                                                                <Text style={{
                                                                                    fontFamily: 'QuickSand',
                                                                                    fontSize: 16,
                                                                                    color: '#424242',
                                                                                    fontStyle: 'italic',
                                                                                }}>+{opt.quantity}x {opt.name}</Text>
                                                                                <Text style={{
                                                                                    fontFamily: 'QuickSand',
                                                                                    fontSize: 16,
                                                                                    color: '#424242',
                                                                                    fontStyle: 'italic',
                                                                                    marginLeft: 10
                                                                                }}>(+{opt.price} {currency})</Text>
                                                                            </View>
                                                                        ))
                                                                    }
                                                                </View>
                                                            </View>
                                                        ))}
                                                    </View>
                                                }
                                            />
                                        </React.Fragment>
                                    ))}

                                    {item.note && <List.Item
                                        titleStyle={
                                            {
                                                marginTop: 20,
                                                marginBottom: 10,
                                                width: "100%",
                                                backgroundColor: "#F7E4C6",
                                                padding: 10,
                                                borderRadius: 10,
                                            }
                                        }
                                        title={
                                            <View style={{
                                                justifyContent: "flex-start",
                                                alignItems: "center",
                                                flexDirection: "row",
                                            }}>
                                                <Ionicons name="information-circle-outline" style={{ color: "#D2691E", fontSize: 20, marginRight: 5 }} />
                                                <Text style={{ color: "#D2691E", fontSize: 13 }}>Note: {item.note}</Text>
                                            </View>
                                        }
                                    />}
                                </React.Fragment>
                            ))
                        }


                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between'
                        }}>
                            <Text></Text>
                            <List.Item title={`${translation("Fees")} : ${order.price_total - order.priceWithoutFee} ${currency}`} titleStyle={{
                                fontFamily: 'Roboto-BoldItalic',
                                fontSize: 16,
                                color: '#424242',
                            }} />
                        </View>

                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between'
                        }}>
                            <Text></Text>
                            <List.Item title={`${translation("Price HT")} : ${order.priceHt_total} ${currency}`} titleStyle={{
                                fontFamily: 'Roboto-BoldItalic',
                                fontSize: 16,
                                color: '#424242',
                            }} />
                        </View>

                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between'
                        }}>
                            <Text></Text>
                            <List.Item title={`${translation("Total price")} : ${order.price_total} ${currency}`} titleStyle={{
                                fontFamily: 'Roboto-BoldItalic',
                                fontSize: 20,
                                color: '#424242',
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
                    title={translation("Fulfillment")} description={translation("Mode, Reserved table, Source, Date and time, Delivery address")} titleStyle={{ color: expandeds[2] ? "#df8f17" : "#7f7f7f", fontFamily: 'Roboto-Regular' }}
                    left={props => <List.Icon {...props} icon="check-circle" color={expandeds[2] ? "#df8f17" : "#7f7f7f"} />} rippleColor={"#df8f17"}
                    style={[
                        {
                            ...(!expandeds[2] && { borderBottomColor: '#7f7f7f', borderBottomWidth: 1 }),
                            backgroundColor: '#fafafa'
                        },
                    ]}>
                    {/* <List.Item titleStyle={{ fontFamily: 'Roboto-Regular' }} title={`${translation("Created at")} : ${order.createdAt.date} ${order.createdAt.time}`} />
                    {order.status !== "pending" && <List.Item titleStyle={{ fontFamily: 'Roboto-Regular' }} title={`${translation("Last update")} : ${order.updatedAt.date} ${order.updatedAt.time}`} />} */}
                    {order.status !== "rejected" && <List.Item titleStyle={{ fontFamily: 'Roboto-Regular' }} title={`${translation("Prepared at")} : ${order.preparedAt ? `${order.preparedAt.date} ${order.preparedAt.time}` : translation("As soon as possible")}`} />}
                    <List.Item titleStyle={{ fontFamily: 'Roboto-Regular' }} title={`${translation("Mode")} : ${order.type}`} />
                    {order.table !== 0 && <List.Item titleStyle={{ fontFamily: 'Roboto-Regular' }} title={`${translation("Reserved table")} : ${order.table}`} />}
                    <List.Item titleStyle={{ fontFamily: 'Roboto-Regular' }} title={`${translation("Source")} : ${order.source}`} />
                    {order.type === "Delivery" && <List.Item titleStyle={{ fontFamily: 'Roboto-Regular' }} title={`${translation("Delivery address")} : ${order.deliveryAdress}`} />}

                </List.Accordion>
                {/* Payment */}
                <List.Accordion

                    expanded={expandeds[3]}
                    onPress={() => handlePress(3)}
                    descriptionStyle={{ fontFamily: 'Roboto-Light', fontSize: 12 }}
                    title={translation("Payment")}
                    description={translation("Status, Method")} titleStyle={{ color: expandeds[3] ? "#df8f17" : "#7f7f7f", fontFamily: 'Roboto-Regular' }}

                    left={props => <List.Icon {...props} icon="cash" color={expandeds[3] ? "#df8f17" : "#7f7f7f"} />} rippleColor={"#df8f17"}
                    style={
                        {
                            backgroundColor: '#fafafa'
                        }
                    }>
                    <List.Item titleStyle={{ fontFamily: 'Roboto-Regular' }} title={`${translation("Method")} : ${order.paymentMethod}`} />
                    <List.Item titleStyle={{ fontFamily: 'Roboto-Regular' }} title={`${translation("Status")} : ${order.paymentStatus}`} />
                </List.Accordion>
            </List.Section>
        </View>
    )
}
