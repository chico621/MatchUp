import { useLocalSearchParams } from "expo-router";
import { Image, View, TouchableOpacity, Text, Alert, StyleSheet, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import axios from "axios";
import { backButton, deleteMatch } from "../apiFunctions";
import AsyncStorage from '@react-native-async-storage/async-storage';

const MatchDetails = () => {
    const { matchId } = useLocalSearchParams(); // Extract matchId from URL params
    const [match, setMatch] = useState<any | null>(null);
    const [user, setUser] = useState<any>(null);
    const [userID, setUserID] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const GOOGLE_MAPS_API_KEY = "AIzaSyAJlWtIahYjVCF3ti2cKfpYsPRRprMMmsY";

    useEffect(() => {
        if (!matchId || typeof matchId !== 'string') {
            setLoading(false);
            return;
        }

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

        fetchUserData();

        // Ensure the matchId is a 24-character string before making the request
        if (matchId.length !== 24) {
            console.error("Invalid Match ID format");
            setLoading(false);
            return;
        }

        // Fetch match details from backend
        axios.get(`http://192.168.0.160:5000/api/v1.0/matches/${matchId}`)
            .then(response => {
                setMatch(response.data); // Set match data on success
            })
            .catch(error => {
                console.error("Error fetching match details:", error);
            })
            .finally(() => {
                setLoading(false); // Stop loading
            });
    }, [matchId]);

    if (loading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (!match) {
        return (
            <View>
                <Text style={styles.errorText}>Error: Match not found or invalid matchId.</Text>
            </View>
        );
    }

    const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(
        match.location
    )}&zoom=15&size=600x300&maptype=roadmap&markers=color:red%7Clabel:S%7C${encodeURIComponent(
        match.location
    )}&key=${GOOGLE_MAPS_API_KEY}`;

    const joinMatch = async () => {
        if (!user || !user.team_id) {
            alert("Team ID not found!");
            return;
        }

        try {

            const response = await axios.put(
                `http://192.168.0.160:5000/api/v1.0/matches/${matchId}`,
                { team_id: user.team_id } // Send the user's team ID
            );

            if (response.status === 200) {
                alert("Successfully joined the match!");
            } else {
                alert("Failed to join the match.");
            }
        } catch (error) {
            alert("An error occurred while joining the match.");
            console.error(error);
        }
    };


    return (
        <View style={styles.matchCard}>
            <TouchableOpacity style={styles.backButton} onPress={backButton}>
                <Text>{'<'}</Text>
            </TouchableOpacity>
            <Text style={styles.title}>{`Team ${match.team1_id} vs Team ${match.team2_id}`}</Text>
            <Text>{`Date: ${match.match_date}`}</Text>
            <Text>{`Time: ${match.match_time}`}</Text>
            <Text>{`Location: ${match.location}`}</Text>

            {/* Google Maps API */}
            <Image
                source={{ uri: staticMapUrl }}
                style={{ width: '100%', height: 200, marginVertical: 10 }}
            />

            <TouchableOpacity
                style={styles.joinButton}
                onPress={joinMatch}
            >
                <Text style={styles.ButtonText}>Join</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteMatch(match._id)}
            >
                <Text style={styles.ButtonText}>Delete</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    title: {
        marginTop: 10,
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: "center",
    },
    loader: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    errorText: {
        textAlign: "center",
        marginTop: 20,
        fontSize: 18,
        color: "red"
    },
    matchCard: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 15,
    },
    backButton: {
        marginTop: 40,
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
    joinButton: {
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 5,
        borderRadius: 50,
        paddingVertical: 12,
        marginTop: 20,
    },
    deleteButton: {
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
});

export default
    MatchDetails;