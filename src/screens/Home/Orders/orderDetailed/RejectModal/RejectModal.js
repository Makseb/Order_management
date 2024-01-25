import Modal from "react-native-modal";
import { View, Text, StyleSheet, TouchableWithoutFeedback, TouchableOpacity } from "react-native"
import AntDesign from "react-native-vector-icons/AntDesign"

import { updateOrderStatus } from "../../../../../shared/slices/Orders/OrdersService";
import { useSelector } from "react-redux";
import { updateState } from "../../../../../shared/slices/Orders/OrdersSlice";
import { store } from "../../../../../shared";
import { useTranslation } from "react-i18next";


export default function RejectOrdersDetailedModal({ modalProps }) {
    const { t: translation } = useTranslation();

    const { rejectModal, setRejectModal } = modalProps

    const changeState = (updatedAt) => {
        store.dispatch(updateState({ id: rejectModal.data.id, action: rejectModal.data.action, stage: rejectModal.data.stage, updatedAt }))
        setRejectModal({
            state: false,
            data: {
                id: undefined,
                stage: undefined,
                action: undefined
            }
        })
    }

    // get notification id from redux
    const notificationId = useSelector((state) => state.authentification.notificationId)

    return (
        <Modal
            isVisible={rejectModal.state}
            onBackdropPress={() => setRejectModal(false)}
            style={{ justifyContent: 'flex-end', margin: 0 }}>
            <View
                style={styles.container}>
                <TouchableWithoutFeedback onPress={() => setRejectModal(!rejectModal)}>
                    <AntDesign
                        style={styles.iconClock}
                        name="arrowleft"
                        size={20}
                    />
                </TouchableWithoutFeedback>

                <View style={styles.rejectContainer}>
                    <TouchableOpacity style={styles.rejectButton} onPress={async (event) => {
                        // update status in backend to rejected
                        const updateOrderStatusToRejected = async () => {
                            await updateOrderStatus({ status: rejectModal.data.action, _id: rejectModal.data.id }, notificationId).then(res => {
                                changeState(res.order.updatedAt)
                            }).catch(err => {
                            })
                        }
                        updateOrderStatusToRejected()
                    }}>
                        <Text style={styles.textRejectButton}>{translation("Reject")}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal >
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        backgroundColor: 'white',
        alignItems: 'center',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    iconClock: {
        alignSelf: 'flex-start',
        paddingTop: '1.5%',
        paddingLeft: '1.5%',
        fontFamily: 'Montserrat-Light',
        color: '#030303'
    },
    rejectContainer: {
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: '3%'
    },
    rejectButton: {
        height: 45,
        width: '40%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ff3b30',
        borderRadius: 22,
    },
    textRejectButton: {
        color: 'white',
        fontFamily: 'Montserrat-Regular',
        fontSize: 18,
    },
})