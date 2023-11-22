import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { useSelector } from 'react-redux';


import { Loader } from "./src/Components/exports"
import { Login, Home } from "./src/screens/exports"




const Stack = createNativeStackNavigator();

export default function App() {
    const isLoading = useSelector((state) => state.root.isLoading)
    const state = useSelector((state) => state.authentification)
    //console.log(state);
    return (
        <>
            <Loader isLoading={isLoading} />
            <NavigationContainer>
                <Stack.Navigator
                // {state.isLoggedIn ? initialRouteName = "Home" : initialRouteName = "Login"}
                    initialRouteName="Login" screenOptions={{ headerShown: false }} >
                    <Stack.Group>
                        <Stack.Screen name="Login" component={Login} />
                        <Stack.Screen name="Home" component={Home} />
                    </Stack.Group>
                </Stack.Navigator>
            </NavigationContainer>
        </>
    );
}