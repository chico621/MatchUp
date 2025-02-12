import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'

const TabsLayout = () => {
    return (
        <Tabs
            screenOptions={{
                tabBarShowLabel: true,
                tabBarStyle: {
                    backgroundColor: 'coral',
                    position: 'absolute',
                    borderTopColor: 'black',
                    borderTopWidth: 1,
                    minHeight: 70,
                }
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    headerShown: false,
                    tabBarIcon: () => (
                        <View>
                            <Text>Home</Text>
                        </View>
                    )
                }}
            />
            <Tabs.Screen
                name="bookings"
                options={{
                    title: 'Matches',
                    headerShown: false,
                    tabBarIcon: () => (
                        <View>
                            <Text>Matches</Text>
                        </View>
                    )
                }}
            />
            <Tabs.Screen
                name="messages"
                options={{
                    title: 'messages',
                    headerShown: false,
                    tabBarIcon: () => (
                        <View>
                            <Text>Messages</Text>
                        </View>
                    )
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'profile',
                    headerShown: false,
                    tabBarIcon: () => (
                        <View>
                            <Text>Profile</Text>
                        </View>
                    )
                }}
            />
        </Tabs>
    )
}

export default TabsLayout