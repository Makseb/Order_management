import { View } from "react-native";
import { List } from 'react-native-paper';

export default function ListSection({ listProps }) {
    const { order, expandeds, handlePress } = listProps;

    return (
        <View>
            {/* order detail */}
            <List.Section >
                {/* Client details */}
                <List.Accordion
                    expanded={expandeds[0]}
                    onPress={() => handlePress(0)}
                    descriptionStyle={{ fontFamily: 'Montserrat-Regular', fontSize: 12 }}
                    title="Client details" description="Phone, E-mail" titleStyle={{ color: expandeds[0] ? "#df8f17" : "#7f7f7f", fontFamily: 'Montserrat-Regular' }}
                    left={props => <List.Icon {...props} icon="information" color={expandeds[0] ? "#df8f17" : "#7f7f7f"} />} rippleColor={"#df8f17"}
                    style={[
                        {
                            ...(!expandeds[0] && { borderBottomColor: '#7f7f7f', borderBottomWidth: 1 }),
                            backgroundColor: '#fafafa'
                        },
                    ]}>
                    <List.Item title={`Phone : ${order.client_phone}`} />
                    <List.Item title={`Email : ${order.client_email}`} />
                </List.Accordion>

                {/* Fulfillment */}
                <List.Accordion
                    expanded={expandeds[1]}
                    onPress={() => handlePress(1)}
                    descriptionStyle={{ fontFamily: 'Montserrat-Regular', fontSize: 12 }}
                    title="Fulfillment" description="Mode, Reserved table, Source, Date and time, Address" titleStyle={{ color: expandeds[1] ? "#df8f17" : "#7f7f7f", fontFamily: 'Montserrat-Regular' }}
                    left={props => <List.Icon {...props} icon="check-circle" color={expandeds[1] ? "#df8f17" : "#7f7f7f"} />} rippleColor={"#df8f17"}
                    style={[
                        {
                            ...(!expandeds[1] && { borderBottomColor: '#7f7f7f', borderBottomWidth: 1 }),
                            backgroundColor: '#fafafa'
                        },
                    ]}>
                    <List.Item title={`Created at : ${order.createdAt.date} ${order.createdAt.time}`} />
                    {order.status !== "pending" && <List.Item title={`Last update : ${order.updatedAt.date} ${order.updatedAt.time}`} />}
                    {order.status !== "rejected" && <List.Item title={`Prepared at : ${order.preparedAt ? `${order.preparedAt.date} ${order.preparedAt.time}` : "still not chosen by you"}`} />}
                    <List.Item title={`Mode : ${order.type}`} />
                    <List.Item title={`Reserved table : ${order.table}`} />
                    <List.Item title={`Source : ${order.source}`} />
                    <List.Item title={`Address : ${order.deliveryAdress}`} />

                </List.Accordion>
                {/* Payment */}
                <List.Accordion
                    expanded={expandeds[2]}
                    onPress={() => handlePress(2)}
                    descriptionStyle={{ fontFamily: 'Montserrat-Regular', fontSize: 12 }}
                    title="Payment" description="Status, Method" titleStyle={{ color: expandeds[2] ? "#df8f17" : "#7f7f7f", fontFamily: 'Montserrat-Regular' }}
                    left={props => <List.Icon {...props} icon="cash" color={expandeds[2] ? "#df8f17" : "#7f7f7f"} />} rippleColor={"#df8f17"}
                    style={
                        {
                            backgroundColor: '#fafafa'
                        }
                    }>
                    <List.Item title={`Status : `} />
                    <List.Item title={`Method : `} />
                </List.Accordion>
            </List.Section>
        </View>
    )
}