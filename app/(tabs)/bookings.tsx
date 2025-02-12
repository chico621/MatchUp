import { View, Text, ScrollView, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'expo-router';

const Bookings = () => {
    const [matches, setMatches] = useState<any[]>([]); // Store matches

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

    // Function to add a match
    { /* const addMatch = () => {
        const formData = new URLSearchParams();
        formData.append('date', '2025-01-23'); // Replace with dynamic values
        formData.append('time', '14:00'); // Replace with dynamic values
        formData.append('location', 'Stadium A'); // Replace with dynamic values

        axios.post('http://192.168.0.160:5000/api/v1.0/matches', formData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        })
            .then(response => {
                if (response.status === 201) {
                    alert('Match added successfully!');
                    fetchMatches();
                }
            })
            .catch(error => {
                console.error('Error adding match:', error);
                alert('Failed to add match.');
            });
        fetchMatches();
    }; */}

    const addMatch = () => {
        router.push("../matches/newMatch");
    };

    // Fetch the selected match
    const router = useRouter();

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
                    alert('Match deleted successfully!');
                    fetchMatches(); // Refresh the list after deletion
                }
            })
            .catch(error => {
                console.error('Error deleting match:', error);
                alert('Failed to delete match.');
            });
    };

    //Fetches match when app is started
    useEffect(() => {
        fetchMatches();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.content}>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.addButton} onPress={addMatch}>
                            <Text style={styles.ButtonText}>Add Match</Text>
                        </TouchableOpacity>
                    </View>

                    <>
                        <Text style={styles.header}>Matches:</Text>
                        {matches.map((match: any) => (
                            <TouchableOpacity key={match._id} onPress={() => fetchMatch(match._id)}>
                                <View style={styles.matchCard}>
                                    <Text>{`Team ${match.team1_id} v Team ${match.team2_id}`}</Text>
                                    <Text>{`Date: ${match.match_date}`}</Text>
                                    <Text>{`Time: ${match.match_time}`}</Text>
                                    <Text>{`Location: ${match.location}`}</Text>
                                    <TouchableOpacity
                                        className="bg-white shadow-md shadow-zinc-300 rounded-full w-full py-4 mt-5">
                                        <Text style={styles.ButtonText}>Join</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        className="bg-white shadow-md shadow-zinc-300 rounded-full w-full py-4 mt-5"
                                        onPress={() => deleteMatch(match._id)}
                                    >
                                        <Text style={styles.ButtonText}>Delete</Text>
                                    </TouchableOpacity>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    buttonContainer: {
        padding: 20,
    },
    scrollContainer: {
        paddingBottom: 20,
    },
    content: {
        flex: 1,
    },
    header: {
        paddingLeft: 10,
        fontSize: 20,
        fontWeight: 'bold',
    },
    matchCard: {
        backgroundColor: '#fff',
        padding: 20,
        margin: 10,
        borderRadius: 8,
        elevation: 5,
        shadowOpacity: 0.2,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        shadowColor: '#000',
    },
    addButton: {
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 5,
        borderRadius: 50,
        paddingVertical: 12,
        marginTop: 10,
    },
    ButtonText: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
    },
    matchDetails: {
        padding: 20,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
    },
});

export default Bookings;
