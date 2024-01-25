import { ScrollView, Text, View, TouchableWithoutFeedback, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { getAllProductByCategoryByStoreId, updateProductAvailabilty } from "../../../../../../shared/slices/Availability/AvailabilityService";
import { setProducts } from "../../../../../../shared/slices/Availability/AvailabilitySlice";
import { useSelector } from "react-redux";
import { store } from "../../../../../../shared";
import { Switch } from "react-native-switch";
import { Header, ProductModal } from "../../../../../exports";
import { useTranslation } from "react-i18next";

export default function Product({ route }) {
    const { t: translation } = useTranslation();

    // get store selected
    const storeSelected = useSelector((state) => state.authentification.storeSelected.store._id)

    // get the category id to fetch the products
    const { categoryId } = route.params;

    // get all products by category and store id
    const products = useSelector((state) => state.availability.products)

    // product selected
    const [productSelected, setProductSelected] = useState({
        state: false,
        indexProduct: null
    })


    console.log(productSelected.state);
    useEffect(() => {
        const fetchAllProductByCategoryByStoreId = async () => {
            await getAllProductByCategoryByStoreId(storeSelected, categoryId).then(res => {
                store.dispatch(setProducts({ products: res.products }))
            }).catch(err => {
            })
        }
        fetchAllProductByCategoryByStoreId()
    }, [])


    return (
        <View style={{
            backgroundColor: 'white',
            flex: 1
        }}>
            <Header />
            <View style={{
                marginHorizontal: '5%'
            }}>
                <Text style={styles.textTitle}>{translation('Products')}</Text>
                {productSelected.state && <ProductModal modalProps={{ productSelected, setProductSelected }} />}
                <ScrollView>
                    {
                        products.map((product, index) => {
                            return (
                                <TouchableWithoutFeedback key={product._id} onPress={() => {
                                    setProductSelected({
                                        state: true,
                                        indexProduct: index
                                    })
                                }} >
                                    <View style={styles.container}>
                                        <View style={{
                                            flexDirection: 'row',
                                            alignItems: 'center'
                                        }}>
                                            <Switch
                                                value={product.availability}
                                                onValueChange={async () => {
                                                    await updateProductAvailabilty({ storeId: storeSelected, value: !product.availability, idCategory: categoryId, idProduct: product._id }).then(res => {
                                                        console.log(res.products);
                                                        store.dispatch(setProducts({ products: res.products }))
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
                                                        borderColor: product.availability ? '#df8f17' : '#7f7f7f'
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
                                                    color: "black",
                                                    fontSize: 18
                                                }}>{product.name}</Text>
                                                <Text style={{
                                                    fontFamily: "Roboto-Light",
                                                    color: "#7f7f7f",
                                                    fontSize: 14
                                                }}>{product.description.length > 25 ? product.description.substring(0, 25) + "..." : product.description}</Text>
                                                {/* if string>25 get only 25 characters */}
                                            </View>
                                        </View>
                                    </View>
                                </TouchableWithoutFeedback>
                            )
                        })
                    }
                </ScrollView>
            </View>
        </View>
    )
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