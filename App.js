import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { useSelector } from 'react-redux';


import { Loader } from "./src/Components/exports"
import { Login, Home, SelectStore, OrderDetailed, Category, Product, PrintingSetting, SearchPrinter, DetailedPrinterSelected, ForgotPassword, ResetPassword, Languages } from "./src/screens/exports"
import { Linking, View } from 'react-native';
import { useEffect } from 'react';
import { store } from './src/shared';
import { setSelectedLanguage } from './src/shared/slices/Languages/LanguagesSlice';
import Toast from 'react-native-toast-message';

import SplashScreen from 'react-native-splash-screen';

const Stack = createNativeStackNavigator();
const navigationRef = React.createRef();

export default function App() {
    const isLoading = useSelector((state) => state.root.isLoading)
    const state = useSelector((state) => state.authentification)
    const selectedlanguage = useSelector((state) => state.languages.selectedlanguage)


    useEffect(() => {
        // Hide splash screen
        SplashScreen.hide();
        // initilize the language (by default english)
        store.dispatch(setSelectedLanguage({ selectedlanguage: selectedlanguage }))

        const handleDeepLink = ({ url }) => {
            const route = url.replace(/.*?:\/\//g, '').split('/');

            // Extract the route and parameters from the URL
            const screen = route[0];
            const params = { id: route[1], token: route[2] };

            const extractScreen = screen.substring(screen.indexOf(':') + 1, screen.length)
            if (navigationRef.current && screen) {
                navigationRef.current.navigate(extractScreen, params);
            }
        };

        // Add the event listener
        const urlListener = Linking.addEventListener('url', handleDeepLink);

        // Clean up the event listener when the component unmounts
        return () => urlListener.remove()
    }, []);

    return (
        <>
            <Loader isLoading={isLoading} />
            <NavigationContainer
                linking={{
                    prefixes: ['demo://app'],
                    config: {
                        screens: {
                            ResetPassword: {
                                path: "/ResetPassword/:id/:token",
                                parse: {
                                    id: (id) => `${id}`,
                                    token: (token) => `${token}`,
                                },
                            }
                        },
                    },
                }}
                ref={navigationRef}
            >

                <Stack.Navigator initialRouteName={state.storeSelected && state.isLoggedIn ? "Home" : state.isLoggedIn ? "SelectStore" : "Login"} screenOptions={{ headerShown: false }} >
                    {/* <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }} > */}
                    <Stack.Group>
                        <Stack.Screen name="Login" component={Login} />
                        <Stack.Screen name="Home" component={Home} />
                        <Stack.Screen name="SelectStore" component={SelectStore} />
                        <Stack.Screen name="OrderDetailed" component={OrderDetailed} />
                        <Stack.Screen name="Category" component={Category} />
                        <Stack.Screen name="Product" component={Product} />
                        <Stack.Screen name="PrintingSetting" component={PrintingSetting} />
                        <Stack.Screen name="SearchPrinter" component={SearchPrinter} />
                        <Stack.Screen name="DetailedPrinterSelected" component={DetailedPrinterSelected} />
                        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
                        <Stack.Screen name="ResetPassword" component={ResetPassword} />
                        <Stack.Screen name="Languages" component={Languages} />
                    </Stack.Group>
                </Stack.Navigator>
            </NavigationContainer>
            <Toast />


        </>
    );
}


