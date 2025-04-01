import { useLocalSearchParams } from "expo-router";
import { Image, View, TouchableOpacity, Text, Alert, StyleSheet, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import axios from "axios";
import { backButton, deleteMatch } from "../apiFunctions";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';

const MatchDetails = () => {
    const { matchId } = useLocalSearchParams(); // Extract matchId from URL params
    const [match, setMatch] = useState<any | null>(null);
    const [user, setUser] = useState<any>(null);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
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
                    const parsedUser = JSON.parse(userData);
                    setIsAdmin(parsedUser.admin);
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
                <ActivityIndicator size="large" color="#007bff" />
                <Text style={styles.loaderText}>Loading match details...</Text>
            </View>
        );
    }

    if (!match) {
        return (
            <View style={styles.errorContainer}>
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
            <Text style={styles.title}>
                {match.team2_name ? `${match.team1_name} v ${match.team2_name}` : match.team1_name}
            </Text>
            <View style={styles.detailsCard}>
                <Text style={styles.details}>{`📅 ${match.match_date}`}</Text>
                <Text style={styles.details}>{`⏰ ${match.match_time}`}</Text>
                <Text style={styles.details}>{`📍 ${match.location}`}</Text>
            </View>

            {/* Google Maps API */}
            <Image
                source={{ uri: staticMapUrl }}
                style={styles.mapImage}
            />

            {/* Action Buttons */}
            <View style={styles.buttonsContainer}>
                <TouchableOpacity style={styles.joinButton} onPress={joinMatch}>
                    <Text style={styles.ButtonText}>Join Match</Text>
                </TouchableOpacity>

                {isAdmin && (
                    <TouchableOpacity style={styles.deleteButton} onPress={() => deleteMatch(match._id)}>
                        <MaterialIcons name="delete" size={18} color="#fff" />
                        <Text style={styles.ButtonText}>Delete Match</Text>
                    </TouchableOpacity>
                )}
            </View>
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
        color: 'white',
        backgroundColor: '#585858',
        borderRadius: 15,
        padding: 5,
    },
    loader: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: '#ecf0f1',
    },
    detailsCard: {
        backgroundColor: '#585858',
        borderRadius: 15,
        padding: 5,
    },
    loaderText: {
        marginTop: 10,
        fontSize: 18,
        color: '#007bff',
    },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    errorText: {
        textAlign: "center",
        marginTop: 20,
        fontSize: 18,
        color: "red"
    },
    matchCard: {
        flex: 1,
        backgroundColor: '#424242',
        padding: 15,
        borderRadius: 12,
        elevation: 5,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
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
    details: {
        fontSize: 16,
        color: 'white',
        marginBottom: 5,
        padding: 5,
    },
    mapImage: {
        width: '100%',
        height: 200,
        marginVertical: 10,
        borderRadius: 10,
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: 20,
    },
    joinButton: {
        backgroundColor: '#4CAF50',
        borderRadius: 50,
        paddingVertical: 12,
        paddingHorizontal: 30,
        shadowOpacity: 0.3,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
        marginHorizontal: 5,
    },
    deleteButton: {
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: '#ff3b30',
        borderRadius: 50,
        paddingVertical: 12,
        paddingHorizontal: 30,
        shadowOpacity: 0.3,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
        marginHorizontal: 5,
    },
    ButtonText: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
});

export default MatchDetails;
