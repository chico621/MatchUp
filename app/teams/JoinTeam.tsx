import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import { backButton } from "../apiFunctions";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const JoinATeam = () => {
    const [teams, setTeams] = useState<any[]>([]);  // Array of teams
    const [searchQuery, setSearchQuery] = useState('');  // Search query input
    const [filteredTeams, setFilteredTeams] = useState<any[]>([]);  // Filtered teams based on search query
    const [authToken, setAuthToken] = useState<string | null>(null);

    // Fetch teams from API
    const fetchTeams = async () => {
        try {
            const response = await axios.get('http://192.168.0.160:5000/api/v1.0/teams', {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            setTeams(response.data);
            setFilteredTeams(response.data);  // Initially, display all teams
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
    const joinTeam = async (teamId: string) => {
        try {
            const response = await axios.post(
                `http://192.168.0.160:5000/api/v1.0/teams/${teamId}/join`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${authToken}`,
                    }
                }
            );
            if (response.status === 200) {
                alert('Successfully joined the team!');
            }
        } catch (error) {
            console.error('Error joining team:', error);
            alert('Failed to join the team.');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={backButton}>
                <Text>{'<'}</Text>
            </TouchableOpacity>
            <Text style={styles.header}>Join a Team</Text>

            {/* Search Bar */}
            <TextInput
                placeholder="Search for a team"
                value={searchQuery}
                onChangeText={handleSearch}
                className="border-b-2 border-black my-4 p-2 margin: 20"
            />

            {/* List of teams */}
            <FlatList
                data={filteredTeams}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <View style={styles.teamItem}>
                        <Text style={styles.teamName}>{item.team_name}</Text>
                        <TouchableOpacity style={styles.joinButton} onPress={() => joinTeam(item._id)}>
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
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    searchInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 8,
        margin: 20,
        fontSize: 16,
    },
    listContainer: {
        paddingBottom: 20,
    },
    teamItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        margin: 5,
        padding: 15,
    },
    teamName: {
        fontSize: 18,
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
