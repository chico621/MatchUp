import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import { backButton } from "../apiFunctions";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const JoinATeam = () => {
    const [teams, setTeams] = useState<any[]>([]);  // Array of teams
    const [searchQuery, setSearchQuery] = useState('');  // Search query input
    const [filteredTeams, setFilteredTeams] = useState<any[]>([]);  // Filtered teams based on search query
    const [authToken, setAuthToken] = useState<string | null>(null); // Auth token for API requests

    // Fetch teams from API
    const fetchTeams = async () => {
        try {
            const response = await axios.get('http://192.168.0.160:5000/api/v1.0/teams', {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            setTeams(response.data);
            setFilteredTeams(response.data);  // Initially, display all teams that user can joij
        } catch (error) {
            console.error('Error fetching teams:', error);
        }
    };

    // Fetch auth token from AsyncStorage
    const fetchAuthToken = async () => {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
            setAuthToken(token);
            fetchTeams();  // Fetch teams once token is retrieved
        }
    };

    useEffect(() => {
        fetchAuthToken();
    }, []);

    // Filter teams based on search query
    const handleSearch = (text: string) => {
        setSearchQuery(text);
        const filtered = teams.filter((team) =>
            team.team_name.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredTeams(filtered);
    };

    // Handle joining a team
    const joinTeam = async (teamId: string, userId: string) => {
        try {
            const response = await axios.put(
                `http://192.168.0.160:5000/api/v1.0/teams/${teamId}/join`,
                { user_id: userId },  // Send the user_id in the request body
                {
                    headers: {
                        'Authorization': `Bearer ${authToken}`,
                        'Content-Type': 'application/json',
                    }
                }
            );

            if (response.status === 200) {
                alert('Successfully joined the team!');
            } else {
                alert('Failed to join the team. Please try again later.');
            }
        } catch (error) {
            alert('Failed to join the team.');
        }
    };

    const fetchUserId = async () => {
        const userId = await AsyncStorage.getItem('userID'); // Fetch User ID from AsyncStorage
        return userId;
    };


    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={backButton}>
                <Text>{'<'}</Text>
            </TouchableOpacity>
            <Text style={styles.header}>Join a Team</Text>

            {/* Search Bar */}
            <TextInput style={styles.searchInput}
                placeholder="Search for a team"
                value={searchQuery}
                onChangeText={handleSearch}
            />

            {/* List of teams */}
            <FlatList
                data={filteredTeams}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <View style={styles.teamItem}>
                        <Text style={styles.teamName}>{item.team_name}</Text>
                        <TouchableOpacity
                            style={styles.joinButton}
                            onPress={async () => {
                                const userId = await fetchUserId(); // Fetch the userId before joining
                                if (userId) {
                                    joinTeam(item._id, userId); // Sends team_id userId to the joinTeam function
                                } else {
                                    alert('User not logged in.');
                                }
                            }}
                        >
                            <Text style={styles.joinButtonText}>Join</Text>
                        </TouchableOpacity>
                    </View>
                )}
                contentContainerStyle={styles.listContainer}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
        paddingHorizontal: 16,
        backgroundColor: '#424242',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'white',
        marginBottom: 20,
    },
    searchInput: {
        backgroundColor: '#fff',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 8,
        margin: 20,
        fontSize: 16,
    },
    listContainer: {
        paddingBottom: 20,
        padding: 15,
    },
    teamItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#585858',
        borderRadius: 10,
        margin: 5,
        padding: 15,
    },
    teamName: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
    },
    joinButton: {
        backgroundColor: '#007BFF',
        borderRadius: 17,
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    joinButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    backButton: {
        marginLeft: 20,
        width: 30,
        height: 30,
        borderRadius: 20,
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default JoinATeam;
