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
                name="index" // Home screen
                options={{
                    title: 'Home',
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home" size={20} color={color} /> // Home icon
                    ),
                }}
            />
            <Tabs.Screen
                name="bookings" // Bookings screen
                options={{
                    title: 'Matches',
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="soccer-field" size={20} color={color} /> // Matches icon
                    ),
                }}
            />
            <Tabs.Screen
                name="messages" // Messages screen
                options={{
                    title: 'Messages',
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="chatbubble-ellipses" size={20} color={color} /> // Messages icon
                    ),
                }}
            />
            <Tabs.Screen
                name="profile" // Profile screen
                options={{
                    title: 'Profile',
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome5 name="users" size={20} color={color} /> // Profile icon
                    ),
                }}
            />
        </Tabs>
    );
};

export default TabsLayout;
