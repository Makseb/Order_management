import React from 'react';

import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

import { Orders, Settings } from '../../exports';

export default function Footer() {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarActiveTintColor: '#df8f17',
                tabBarInactiveTintColor: '#7f7f7f',
                tabBarShowLabel: true,
                headerShown: false,
                tabBarItemStyle: {
                    marginVertical: 8,
                },
                tabBarStyle: {
                    height: 70,
                    borderTopWidth: 0,
                    elevation: 25,
                    // shadowColor: '#030303', // Set shadow color to rgba(3,3,3,0.1)
                    // shadowOffset: {
                    //     width: 0, // Set x offset to 0
                    //     height: 2, // Set y offset to 2
                    // },
                    // shadowOpacity: 0.1, // Set shadow opacity to 0.1
                    // shadowRadius: 10, // Set shadow blur radius to 10

                },
            }}>
            <Tab.Screen name="Orders" component={Orders} options={{
                tabBarLabelPosition: 'below-icon',
                tabBarLabelStyle: {
                    fontFamily: 'Montserrat-Light',
                    fontSize: 16,
                },
                tabBarIcon: ({ focused }) => (
                    <MaterialIcons name='checklist' size={24} color={focused ? '#df8f17' : '#7f7f7f'} />
                ),
            }}
            />
            <Tab.Screen name="Settings" component={Settings} options={{
                tabBarLabelPosition: 'below-icon',
                tabBarLabelStyle: {
                    fontFamily: 'Montserrat-Light',
                    fontSize: 16,
                },
                tabBarIcon: ({ focused }) => (
                    <Icon name='settings' size={24} color={focused ? '#df8f17' : '#7f7f7f'} />
                ),
            }}
            />
        </Tab.Navigator>
    )
}