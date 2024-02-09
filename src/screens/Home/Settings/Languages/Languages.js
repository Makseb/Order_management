import { Dimensions, StyleSheet, TouchableWithoutFeedback, View } from "react-native"
import { Header } from "../../../exports"
import { Text } from "react-native-paper"
import { useSelector } from "react-redux";
import CountryFlag from "react-native-country-flag";
import { store } from "../../../../shared";
import { setSelectedLanguage } from "../../../../shared/slices/Languages/LanguagesSlice";
import { useTranslation } from "react-i18next";

export default function Languages() {
    const languages = useSelector((state) => state.languages.languages)
    const selectedlanguage = useSelector((state) => state.languages.selectedlanguage)
    const { t: translation } = useTranslation();

    return (
        <View style={{
            flex: 1,
            backgroundColor: 'white'
        }}>
            <Header />
            <Text style={styles.title}>{translation("Languages")}</Text>
            {
                languages.map(language => (
                    <TouchableWithoutFeedback key={language.iso} onPress={() => store.dispatch(setSelectedLanguage({ selectedlanguage: language }))}>
                        <View key={language.iso} style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginLeft: '5%',
                            marginBottom: '1%',
                            width: '30%',
                            backgroundColor: language.iso === selectedlanguage.iso ? '#fdcd85' : 'white',
                            padding: '1%',
                            borderRadius: 10
                        }}>
                            <CountryFlag isoCode={language.iso} style={{
                                borderRadius: Math.round(Dimensions.get('window').width + Dimensions.get('window').height) / 2 / 12,
                                width: Dimensions.get('window').width * 0.5 / 12,
                                height: Dimensions.get('window').width * 0.5 / 12,
                            }} />
                            <Text style={{
                                marginLeft: '8%',
                                fontFamily: "Roboto-Regular",
                                color: "#030303",
                                fontSize: 16
                            }}>{language.name}</Text>
                        </View>

                    </TouchableWithoutFeedback>
                ))
            }
        </View>
    )
}
const styles = StyleSheet.create({
    title: {
        marginLeft: '5%',
        marginBottom: '2%',
        // marginBottom: '4%',
        color: '#030303',
        fontSize: 20,
        fontFamily: 'Montserrat-Regular'
    }
})