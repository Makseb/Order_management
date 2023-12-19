import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { useSelector } from 'react-redux';


import { Loader } from "./src/Components/exports"
import { Login, Home, SelectStore, OrderDetailed, Category, Product } from "./src/screens/exports"


const Stack = createNativeStackNavigator();

export default function App() {
    const isLoading = useSelector((state) => state.root.isLoading)
    const state = useSelector((state) => state.authentification)
    return (
        <>
            <Loader isLoading={isLoading} />
            <NavigationContainer>
                <Stack.Navigator initialRouteName={state.storeSelected && state.isLoggedIn ? "Home" : state.isLoggedIn ? "SelectStore" : "Login"} screenOptions={{ headerShown: false }} >
                    {/* <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }} > */}
                    <Stack.Group>
                        <Stack.Screen name="Login" component={Login} />
                        <Stack.Screen name="Home" component={Home} />
                        <Stack.Screen name="SelectStore" component={SelectStore}  />
                        <Stack.Screen name="OrderDetailed" component={OrderDetailed} />
                        <Stack.Screen name="Category" component={Category} />
                        <Stack.Screen name="Product" component={Product} />
                    </Stack.Group>
                </Stack.Navigator>
            </NavigationContainer>
        </>
    );
}
