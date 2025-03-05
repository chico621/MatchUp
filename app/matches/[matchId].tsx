import { useLocalSearchParams } from "expo-router";
import { Image, View, TouchableOpacity, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import axios from "axios";
import { backButton, deleteMatch } from "../apiFunctions";

const MatchDetails = () => {
    const { matchId } = useLocalSearchParams(); // Extract matchId from URL params
    const [match, setMatch] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    const GOOGLE_MAPS_API_KEY = "AIzaSyAJlWtIahYjVCF3ti2cKfpYsPRRprMMmsY";

    useEffect(() => {
        if (!matchId || typeof matchId !== 'string') {
            setLoading(false);
            return;
        }

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

    return (
        <View style={styles.matchCard}>
            <TouchableOpacity style={styles.backButton} onPress={backButton}>
                <Text>{'<'}</Text>
            </TouchableOpacity>
            <Text style={styles.title}>{`Team ${match.team1_id} vs Team ${match.team2_id}`}</Text>
            <Text>{`Date: ${match.match_date}`}</Text>
            <Text>{`Time: ${match.match_time}`}</Text>
            <Text>{`Location: ${match.location}`}</Text>

            {/* Google Maps API*/}
            <Image
                source={{ uri: staticMapUrl }}
                style={{ width: '100%', height: 200, marginVertical: 10 }}
            />

            <TouchableOpacity
                className="bg-white shadow-md shadow-zinc-300 rounded-full w-full py-4 mt-5">
                <Text className="text-center text-black font-bold">Join</Text>
            </TouchableOpacity>
            <TouchableOpacity
                className="bg-white shadow-md shadow-zinc-300 rounded-full w-full py-4 mt-5"
                onPress={() => deleteMatch(match._id)}
            >
                <Text className="text-center text-black font-bold">Delete</Text>
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
    googleMaps: {
        marginVertical: 10,
        borderRadius: 10,
        overflow: 'hidden',
        backgroundColor: 'black',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    }
});

export default MatchDetails;
