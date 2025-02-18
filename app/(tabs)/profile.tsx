import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from "expo-router";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useIsFocused } from '@react-navigation/native';

const Profile = () => {
    const [user, setUser] = useState<any>(null);
    const [userID, setUserID] = useState<string | null>(null);
    const router = useRouter();
    const isFocused = useIsFocused();

    // Fetch user data when screen is focused
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userData = await AsyncStorage.getItem('user');
                if (userData) {
                    setUser(JSON.parse(userData));
                }
            } catch (error) {
                console.log('Error fetching user data:', error);
                Alert.alert('Error', 'There was an issue loading your profile data.');
            }
        };

        const fetchUserID = async () => {
            const storedUserID = await AsyncStorage.getItem('userID');
            if (storedUserID) {
                setUserID(storedUserID);
            }
        };

        if (isFocused) {
            fetchUserData();
            fetchUserID();
        }
    }, [isFocused]);

    const handleLogout = async () => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            if (token) {
                const response = await axios.get('http://192.168.0.160:5000/api/v1.0/logout', {
                    headers: { 'x-access-token': token },
                });

                if (response.status === 200) {
                    // Clear AsyncStorage on successful logout
                    await AsyncStorage.removeItem('authToken');
                    await AsyncStorage.removeItem('user');
                    await AsyncStorage.removeItem('userID');

                    setUser(null);
                    setUserID(null);

                    Alert.alert('Logged out successfully!', 'You have been logged out.', [
                        { text: 'OK', onPress: () => router.push('/signin') },
                    ]);
                } else {
                    Alert.alert('Error', 'Logout failed. Please try again later.');
                }
            }
        } catch (error) {
            console.log('Logout failed:', error);
            Alert.alert('Error', 'Something went wrong during logout. Please try again later.');
        }
    };

    if (!user) {
        return (
            <SafeAreaView style={styles.centeredContainer}>
                <Text style={styles.noUserText}>Please login to view your profile</Text>
                <Link style={styles.noUserText} href="/signin">Sign In Here</Link>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.centeredContainer}>
            <Text style={styles.profileTitle}>Profile</Text>

            <View style={styles.userDetailsContainer}>
                <View style={styles.userDetailCard}>
                    <Text style={styles.userDetailText}>Username: {user.username}</Text>
                    <Text style={styles.userDetailText}>Name: {user.name}</Text>
                    <Text style={styles.userDetailText}>Email: {user.email}</Text>
                </View>
            </View>

            <TouchableOpacity onPress={handleLogout} className="bg-white shadow-md shadow-zinc-300 rounded-full w-full py-4 mt-5">
                <Text className="text-center" style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    centeredContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 20,
    },
    noUserText: {
        fontSize: 18,
        color: 'gray',
        textAlign: 'center',
    },
    profileTitle: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
    },
    userDetailsContainer: {
        width: '100%',
        alignItems: 'center',
    },
    userDetailCard: {
        backgroundColor: '#f9f9f9',
        padding: 20,
        borderRadius: 10,
        width: '100%',
        marginBottom: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    userDetailText: {
        fontSize: 18,
        color: '#555',
        marginBottom: 10,
    },
    logoutButton: {
        backgroundColor: '#F44336',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 50,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
    },
    logoutButtonText: {
        color: 'Black',
        fontSize: 18,
        fontWeight: '600',
    },
});

export default Profile;
