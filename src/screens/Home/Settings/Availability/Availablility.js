import { ScrollView, Text, View, TouchableWithoutFeedback } from "react-native";
import Header from "../../Header/Header";
import { useEffect, useState } from "react";
import { getAllCategoriesByStoreId } from "../../../../shared/slices/Availability/AvailabilityService";
import { useSelector } from "react-redux";
import { store } from "../../../../shared";
import { setCategories } from "../../../../shared/slices/Availability/AvailabilitySlice";
import Feather from "react-native-vector-icons/Feather";
import { AvailabilityModal } from "../../../../screens/exports";

export default function Availability() {
    // get store selected
    const storeSelected = useSelector((state) => state.authentification.storeSelected._id)

    // get all categories
    const categories = useSelector((state) => state.availability.categories)

    // category selected
    const [categorySelected, setCategorySelected] = useState({
        state: false,
        category: null
    })

    useEffect(() => {
        const fetchAllCategoriesByStoreId = async () => {
            await getAllCategoriesByStoreId(storeSelected).then(res => {
                store.dispatch(setCategories({ categories: res.categories }))
            }).catch(err => {
            })
        }
        fetchAllCategoriesByStoreId()
    }, [])

    return <View style={{
        backgroundColor: 'white',
        flex: 1
    }}>
        <Header />
        <View style={{
            marginHorizontal: '5%'
        }}>
            <Text style={{
                fontFamily: "Montserrat-Regular",
                color: "black",
                fontSize: 18,
            }}>Categories</Text>

            {categorySelected.state && <AvailabilityModal modalProps={{ categorySelected, setCategorySelected }} />}
            <ScrollView>
                {
                    categories.map((category, index) => {
                        return (
                            <TouchableWithoutFeedback key={category._id} onPress={() => {
                                setCategorySelected({
                                    state: true,
                                    category: category
                                })
                            }} >
                                <View style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    paddingVertical: '2%',
                                    // backgroundColor: '#f1f1f1',
                                    // marginRight: '50%'
                                }}>

                                    <View >
                                        <Text style={{
                                            fontFamily: "Roboto-Light",
                                            color: "black",
                                            fontSize: 18
                                        }}>{category.name}</Text>
                                        <Text style={{
                                            fontFamily: "Roboto-Light",
                                            color: "#7f7f7f",
                                            fontSize: 14
                                        }}>{category.description}</Text>
                                    </View>
                                    <View style={{
                                        backgroundColor: '#7f7f7f',
                                        borderRadius: 5,
                                        width: 30,
                                        height: 30,
                                        borderRadius: 22,
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}>
                                        <Feather name="arrow-right" size={20} color="white" />
                                    </View>
                                </View>
                            </TouchableWithoutFeedback>
                        )
                    })
                }
            </ScrollView>
        </View>
    </View>
}