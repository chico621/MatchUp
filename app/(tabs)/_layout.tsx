import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

const TabsLayout = () => {
    return (
        <Tabs
            screenOptions={{
                tabBarShowLabel: true,
                tabBarStyle: {
                    backgroundColor: 'white',
                    position: 'absolute',
                    borderTopColor: 'black',
                    borderTopWidth: 0,
                    minHeight: 70,
                },
                tabBarActiveTintColor: 'black',
                tabBarInactiveTintColor: 'grey',
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home" size={20} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="bookings"
                options={{
                    title: 'Matches',
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="soccer-field" size={20} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="messages"
                options={{
                    title: 'Messages',
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="chatbubble-ellipses" size={20} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome5 name="users" size={20} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
};

export default TabsLayout;
