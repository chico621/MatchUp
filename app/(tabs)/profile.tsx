import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from "expo-router";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useIsFocused } from '@react-navigation/native';

const Profile = () => {
    const [user, setUser] = useState<any>(null); // This will hold the user data
    const [userID, setUserID] = useState<string | null>(null); // This will hold the user ID
    const [teamName, setTeamName] = useState<string | null>(null); // This will hold the team name
    const router = useRouter(); // This will be used to navigate to other screens
    const isFocused = useIsFocused(); // This will be used to check if the screen is focused

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userData = await AsyncStorage.getItem('user'); // This will get the user data from AsyncStorage
                if (userData) {
                    const parsedUser = JSON.parse(userData);
                    setUser(parsedUser); // Set the user data to state

                    if (parsedUser.team_id) {
                        fetchTeamData(parsedUser.team_id); // This will fetch the team data using the team ID
                    }
                }
            } catch (error) {
                console.log('Error fetching user data:', error);
                Alert.alert('Error', 'There was an issue loading your profile data.');
            }
        };

        const fetchUserID = async () => { // This will get the user ID from AsyncStorage
            const storedUserID = await AsyncStorage.getItem('userID');
            if (storedUserID) {
                setUserID(storedUserID);
            }
        };

        const fetchTeamData = async (teamID: string) => {
            try {
                const response = await axios.get(`http://192.168.0.160:5000/api/v1.0/teams/${teamID}`); // Fetch team data using the team ID
                if (response.data) {
                    setTeamName(response.data.team_name);

                }
            } catch (error) {
                console.log('Error fetching team data:', error);
                setTeamName(null);
            }
        };

        if (isFocused) {
            fetchUserData();
            fetchUserID();
        }
    }, [isFocused]);

    const addTeam = () => {
        router.push("../teams/newTeam"); // This will navigate to the new team screen
    };

    const JoinTeam = () => {
        router.push("../teams/JoinTeam"); // This will navigate to the join team screen
    };

    const handleLogout = async () => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            if (token) {
                const response = await axios.get('http://192.168.0.160:5000/api/v1.0/logout', { // Logout endpoint
                    headers: { 'x-access-token': token },
                });

                if (response.status === 200) {
                    await AsyncStorage.removeItem('authToken'); // Remove the auth token
                    await AsyncStorage.removeItem('user'); // Remove the user data
                    await AsyncStorage.removeItem('userID'); // Remove the user ID

                    setUser(null);
                    setUserID(null);
                    setTeamName(null);

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
            <SafeAreaView style={styles.container}>
                <Text style={styles.noUserText}>Please login to view your profile</Text> {/* This is the text that will be displayed when the user is not logged in */}
                <Link style={styles.noUserText} href="/signin">Sign In Here</Link>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.profileTitle}>Profile</Text>

            {/* Display user details */}

            <View style={styles.userDetailsContainer}>
                <View style={styles.userDetailCard}>
                    <Text style={styles.userDetailText}>Username: {user.username}</Text>
                    <Text style={styles.userDetailText}>Name: {user.name}</Text>
                    <Text style={styles.userDetailText}>Email: {user.email}</Text>
                </View>
            </View>

            <Text style={styles.profileTitle}>Teams</Text>

            {/* Display users team details */}

            <View style={styles.userDetailsContainer}>
                <View style={styles.userDetailCard}>
                    <Text style={styles.userDetailText}>
                        Current Team: {teamName ? teamName : "Not in a team"}
                    </Text>

                    <TouchableOpacity style={styles.addButton} onPress={JoinTeam}>
                        <Text style={styles.ButtonText}>Join a team</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.addButton} onPress={addTeam}>
                        <Text style={styles.ButtonText}>Create new team</Text>
                    </TouchableOpacity>
                </View>
            </View>
            {/* Logout button */}
            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                <Text className="text-center" style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#424242',
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
        color: 'white',
        marginBottom: 20,
    },
    userDetailsContainer: {
        width: '100%',
        alignItems: 'center',
    },
    userDetailCard: {
        backgroundColor: '#585858',
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
        color: '#fff',
        marginBottom: 10,
    },
    logoutButton: {
        backgroundColor: '#C24C43',
        paddingHorizontal: 24,
        paddingVertical: 12,
        width: '100%',
        marginTop: 20,
        borderRadius: 50,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
    },
    logoutButtonText: {
        color: 'Black',
        fontSize: 18,
        fontWeight: '600',
    },
    addButton: {
        backgroundColor: '#7f7f7f',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 5,
        borderRadius: 50,
        paddingVertical: 12,
        margin: 5,
    },
    ButtonText: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default Profile;
