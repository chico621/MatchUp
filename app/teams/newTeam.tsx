import { View, Text, ScrollView, SafeAreaView, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { backButton } from "../apiFunctions";
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React from 'react';

const NewTeam = () => {
    const [teamName, setTeamName] = useState(''); // To store team name input
    const [userID, setUserID] = useState<string | null>(null); // To store user ID

    useEffect(() => {
        const fetchUserID = async () => { // Fetch userID from AsyncStorage
            try {
                const storedUserID = await AsyncStorage.getItem('userID');
                if (storedUserID) {
                    setUserID(storedUserID);
                }
            } catch (error) {
                console.error('Error fetching userID from AsyncStorage:', error);
            }
        };

        fetchUserID();
    }, []);

    const submitTeam = async () => { // Validate team name and user ID
        if (!teamName) {
            alert('Please fill in the team name!');
            return;
        }

        if (!userID) {
            alert("User ID not found!");
            return;
        }

        try {
            const token = await AsyncStorage.getItem('authToken'); // Checks if user is logged in
            if (!token) {
                alert("You're not logged in!");
                return;
            }

            const formData = new URLSearchParams();
            formData.append('team_name', teamName);
            formData.append('user_id', userID); // Using stored userID
            formData.append('players', JSON.stringify([]));

            const response = await axios.post('http://192.168.0.160:5000/api/v1.0/teams', formData, { // API call to create a new team, appends formData
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'x-access-token': `${token}`
                }
            });

            if (response.status === 201) {
                alert('Team created successfully!');
                setTeamName('');
            }
        } catch (error) {
            alert('An error occurred while creating the team.');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <TouchableOpacity style={styles.backButton} onPress={backButton}>
                    <Text>{'<'}</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Create a New Team</Text>

                {/* Team Name */}
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Team Name:</Text>
                    <TextInput
                        style={styles.input}
                        value={teamName}
                        onChangeText={setTeamName}
                        placeholder="Enter team name"
                        keyboardType="default"
                    />
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.addButton} onPress={submitTeam}>
                        <Text style={styles.ButtonText}>Submit</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#585858',
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
    buttonContainer: {
        padding: 20,
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
    title: {
        fontSize: 20,
        textAlign: 'center',
        color: 'white',
    },
    inputContainer: {
        marginBottom: 20,
        paddingHorizontal: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        color: 'white',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowRadius: 3,
        shadowOpacity: 0.1,
        padding: 10,
        fontSize: 16,
    },
});

export default NewTeam;
