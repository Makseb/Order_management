import { ScrollView, Text, View, TouchableWithoutFeedback, StyleSheet } from "react-native";
import { CategoryModal, Header } from "../../../../../screens/exports";
import { useEffect, useState } from "react";
import { getAllCategoriesByStoreId, updateCategoryAvailabilty } from "../../../../../shared/slices/Availability/AvailabilityService";
import { useSelector } from "react-redux";
import { store } from "../../../../../shared";
import Feather from "react-native-vector-icons/Feather";
import { Switch } from "react-native-switch";
import { setCategories } from "../../../../../shared/slices/Availability/AvailabilitySlice";
import { useNavigation } from "@react-navigation/native";


export default function Category() {
    // get store selected
    const storeSelected = useSelector((state) => state.authentification.storeSelected.store._id)

    // get all categories
    const categories = useSelector((state) => state.availability.categories)

    // category selected
    const [categorySelected, setCategorySelected] = useState({
        state: false,
        indexCategory: null
    })

    const navigation = useNavigation()

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
            <Text style={styles.textTitle}>Categories</Text>
            {categorySelected.state && <CategoryModal modalProps={{ categorySelected, setCategorySelected }} />}
            <ScrollView>
                {
                    categories.map((category, index) => {
                        return (
                            <TouchableWithoutFeedback key={category._id} onPress={() => {
                                setCategorySelected({
                                    state: true,
                                    indexCategory: index
                                })
                            }} >
                                <View style={styles.container}>
                                    <View style={{
                                        flexDirection: 'row',
                                        alignItems: 'center'
                                    }}>
                                        <Switch
                                            value={category.availability}
                                            onValueChange={async () => {
                                                await updateCategoryAvailabilty({ storeId: storeSelected, value: !category.availability, idCategory: category._id }).then(res => {
                                                    store.dispatch(setCategories({ categories: res.categories }))
                                                })
                                            }}
                                            disabled={false}
                                            activeText={'On'}
                                            inActiveText={'Off'}
                                            circleSize={20}
                                            // barHeight={1}
                                            // circleBorderWidth={3}
                                            backgroundActive={'white'} // #e7e7e7
                                            backgroundInactive={'white'}
                                            circleActiveColor={'#df8f17'}
                                            circleInActiveColor={'#7f7f7f'} //#df8f17
                                            // renderInsideCircle={() => <CustomComponent />} // custom component to render inside the Switch circle (Text, Image, etc.)
                                            changeValueImmediately={true} // if rendering inside circle, change state immediately or wait for animation to complete
                                            innerCircleStyle={{ alignItems: "center", justifyContent: "center", borderWidth: 0 }} // style for inner animated circle for what you (may) be rendering inside the circle
                                            outerCircleStyle={{}} // style for outer animated circle
                                            containerStyle={
                                                {
                                                    borderWidth: 1,
                                                    borderColor: category.availability ? '#df8f17' : '#7f7f7f' 
                                                }
                                            }
                                            renderActiveText={false}
                                            renderInActiveText={false}
                                            switchLeftPx={2} // denominator for logic when sliding to TRUE position. Higher number = more space from RIGHT of the circle to END of the slider
                                            switchRightPx={2} // denominator for logic when sliding to FALSE position. Higher number = more space from LEFT of the circle to BEGINNING of the slider
                                            switchWidthMultiplier={2} // multiplied by the `circleSize` prop to calculate total width of the Switch
                                            switchBorderRadius={20} // Sets the border Radius of the switch slider. If unset, it remains the circleSize.
                                        />
                                        <View style={{ paddingLeft: '8%' }}>
                                            <Text style={{
                                                fontFamily: "Roboto-Light",
                                                color: "#030303",
                                                fontSize: 18
                                            }}>{category.name}</Text>
                                            <Text style={{
                                                fontFamily: "Roboto-Light",
                                                color: "#7f7f7f",
                                                fontSize: 14
                                            }}>{category.description}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.containerArrowRight}>
                                        <Feather onPress={
                                            () => navigation.navigate('Product', { categoryId: category._id })
                                        } name="arrow-right" size={20} color="white" />
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
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: '2%',
        // backgroundColor: '#cccccc',
        // borderBottomWidth : 2,
        // borderBottomColor : '#f4f4f4',
        // marginRight: '50%'

    },
    textTitle: {
        fontFamily: "Montserrat-Regular",
        color: "#030303",
        fontSize: 18,
    },
    containerArrowRight: {
        backgroundColor: '#7f7f7f',
        borderRadius: 5,
        width: 30,
        height: 30,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center'
    }
})