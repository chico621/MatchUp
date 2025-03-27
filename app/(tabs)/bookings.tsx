import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, SafeAreaView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect

const Bookings = () => {
    const [matches, setMatches] = useState<any[]>([]); // Store matches
    const [isAdmin, setIsAdmin] = useState<boolean>(false); // Admin status
    const router = useRouter();

    // Fetch matches
    const fetchMatches = () => {
        axios.get('http://192.168.0.160:5000/api/v1.0/matches')
            .then(response => {
                setMatches(response.data);
            })
            .catch(error => {
                console.error('Error fetching matches:', error);
            });
    };

    // Fetch user info (including admin status)
    const fetchUserInfo = async () => {
        try {
            const userInfo = await AsyncStorage.getItem('user');
            if (userInfo) {
                const parsedUser = JSON.parse(userInfo);
                setIsAdmin(parsedUser.admin); // Assuming the 'admin' field is stored as a boolean
            }
        } catch (error) {
            console.error('Error fetching user info:', error);
        }
    };

    // Fetch the selected match
    const fetchMatch = (matchId: string) => {
        axios.get(`http://192.168.0.160:5000/api/v1.0/matches/${matchId}`)
            .then(response => {
                router.push(`../matches/${matchId}`);
            })
            .catch(error => {
                console.error('Error fetching match:', error);
            });
    };

    // Function to delete a match
    const deleteMatch = (matchId: string) => {
        axios.delete(`http://192.168.0.160:5000/api/v1.0/matches/${matchId}`)
            .then(response => {
                if (response.status === 204) {
                    Alert.alert('Match deleted successfully!');
                    fetchMatches(); // Refresh the list after deleting match
                }
            })
            .catch(error => {
                console.error('Error deleting match:', error);
                Alert.alert('Failed to delete match.');
            });
    };

    useEffect(() => {
        fetchMatches(); // Fetch matches on initial load
        fetchUserInfo(); // Fetch user info (for retrieving admin status)
    }, []);

    // Re-fetch matches when the screen is focused using useFocusEffect
    useFocusEffect(
        React.useCallback(() => {
            fetchMatches(); // Refresh matches when the screen is focused, this allows me to update the list after adding a new match
        }, [])
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.addButton} onPress={() => router.push("../matches/newMatch")}>
                            <Text style={styles.ButtonText}>Add Match</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.header}>Matches:</Text>
                    {matches.map((match: any) => (
                        <TouchableOpacity key={match._id} onPress={() => fetchMatch(match._id)}>
                            <View style={styles.matchCard}>
                                <Text>{`Team ${match.team1_id} v Team ${match.team2_id}`}</Text>
                                <Text>{`Date: ${match.match_date}`}</Text>
                                <Text>{`Time: ${match.match_time}`}</Text>
                                <Text>{`Location: ${match.location}`}</Text>

                                {/* Only show Delete button if the current user is admin */}
                                {isAdmin && (
                                    <TouchableOpacity
                                        style={styles.button}
                                        onPress={() => deleteMatch(match._id)} >
                                        <Text style={styles.ButtonText}>Delete</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#424242',
    },
    buttonContainer: {
        padding: 15,
    },
    scrollContainer: {
        paddingBottom: 20,
        paddingHorizontal: 10,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 20,
        marginLeft: 10,
    },
    matchCard: {
        backgroundColor: '#585858',
        padding: 20,
        marginBottom: 15,
        borderRadius: 12,
        elevation: 5,
        shadowOpacity: 0.2,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        shadowColor: '#000',
        borderWidth: 1,
        borderColor: '#444',
    },
    matchInfoText: {
        color: '#fff',
        fontSize: 16,
        marginBottom: 8,
    },
    addButton: {
        backgroundColor: '#007bff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 5,
        borderRadius: 50,
        paddingVertical: 14,
        marginBottom: 20,
    },
    ButtonText: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    button: {
        backgroundColor: '#ff4d4d',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 8,
        marginTop: 15,
        alignSelf: 'flex-start',
    },
});

export default Bookings;
