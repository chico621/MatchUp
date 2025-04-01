import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, SafeAreaView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';

const Bookings = () => {
    const [matches, setMatches] = useState<any[]>([]);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const router = useRouter();

    const fetchMatches = () => {
        axios.get('http://192.168.0.160:5000/api/v1.0/matches')
            .then(response => {
                setMatches(response.data);
            })
            .catch(error => {
                console.error('Error fetching matches:', error);
            });
    };

    const fetchUserInfo = async () => {
        try {
            const userInfo = await AsyncStorage.getItem('user');
            if (userInfo) {
                const parsedUser = JSON.parse(userInfo);
                setIsAdmin(parsedUser.admin);
            }
        } catch (error) {
            console.error('Error fetching user info:', error);
        }
    };

    const fetchMatch = (matchId: string) => {
        router.push(`../matches/${matchId}`);
    };

    const deleteMatch = (matchId: string) => {
        Alert.alert(
            "Confirm Delete",
            "Are you sure you want to delete this match?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete", onPress: () => {
                        axios.delete(`http://192.168.0.160:5000/api/v1.0/matches/${matchId}`)
                            .then(response => {
                                if (response.status === 204) {
                                    Alert.alert('Match deleted successfully!');
                                    fetchMatches();
                                }
                            })
                            .catch(error => {
                                console.error('Error deleting match:', error);
                                Alert.alert('Failed to delete match.');
                            });
                    }, style: "destructive"
                }
            ]
        );
    };

    useEffect(() => {
        fetchMatches();
        fetchUserInfo();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            fetchMatches();
        }, [])
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.addButton} onPress={() => router.push("../matches/newMatch")}>
                        <AntDesign name="pluscircleo" size={20} color="#fff" style={styles.icon} />
                        <Text style={styles.ButtonText}>Add Match</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.header}>Upcoming Matches</Text>
                {matches.map((match: any) => (
                    <TouchableOpacity key={match._id} onPress={() => fetchMatch(match._id)}>
                        <View style={styles.matchCard}>
                            <Text style={styles.matchTitle}>{match.team1_name} {match.team2_name ? `vs ${match.team2_name}` : "(Looking for opponent)"}</Text>
                            <Text style={styles.matchInfo}>{`📅 ${match.match_date}  |  ⏰ ${match.match_time}`}</Text>
                            <Text style={styles.matchInfo}>{`📍 ${match.location}`}</Text>
                            {isAdmin && (
                                <TouchableOpacity style={styles.deleteButton} onPress={() => deleteMatch(match._id)}>
                                    <MaterialIcons name="delete" size={18} color="#fff" />
                                    <Text style={styles.deleteText}>Delete</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#424242',
    },
    scrollContainer: {
        paddingBottom: 20,
        paddingHorizontal: 10,
    },
    buttonContainer: {
        alignItems: 'center',
        marginVertical: 15,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#007bff',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 25,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 5,
    },
    icon: {
        marginRight: 8,
    },
    ButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 15,
    },
    matchCard: {
        backgroundColor: '#585858',
        padding: 20,
        marginBottom: 15,
        borderRadius: 12,
        shadowOpacity: 0.3,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 3 },
        borderWidth: 1,
        borderColor: '#3a3a3c',
    },
    matchTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 6,
    },
    matchInfo: {
        color: '#bbb',
        fontSize: 14,
        marginBottom: 4,
    },
    deleteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ff3b30',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 8,
        marginTop: 12,
        alignSelf: 'flex-start',
    },
    deleteText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
        marginLeft: 5,
    },
});

export default Bookings;
