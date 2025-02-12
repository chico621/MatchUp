import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Profile = () => {

    const handleLogout = async () => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            if (token) {
                await axios.get('http://192.168.0.160:5000/api/v1.0/logout', {
                    headers: { 'x-access-token': token },
                });
            }

        } catch (error) {
            console.log('Logout failed:', error);
        }
    };


    return (
        <SafeAreaView className="flex-1 items-center justify-center bg-white">
            <Text className="text-xl font-bold mb-5">Profile Screen</Text>

            <TouchableOpacity
                onPress={handleLogout}
                className="bg-red-500 px-6 py-3 rounded-full shadow-md"
            >
                <Text className="text-white text-lg font-semibold">Logout</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default Profile;
