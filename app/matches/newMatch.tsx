import { View, Text, ScrollView, SafeAreaView, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { backButton } from "../apiFunctions";
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React from 'react';

const NewMatch = () => {
    // State to hold user input
    const [date, setDate] = useState(''); // To store date input
    const [time, setTime] = useState(''); // To store time input
    const [location, setLocation] = useState(''); // To store location input
    const [team1Id, setTeam1Id] = useState(''); // To store team1_id

    // Fetch user info when the component mounts
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const userData = await AsyncStorage.getItem('user');
                if (userData) {
                    const parsedUser = JSON.parse(userData);
                    setTeam1Id(parsedUser.team_id);
                }
            } catch (error) {
                console.error('Error fetching user info:', error);
            }
        };

        fetchUserInfo();
    }, []);

    // Function to validate date format (DD/MM/YYYY)
    const isValidDate = (date: string) => {
        const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
        return regex.test(date);
    };

    // Function to validate time format (HH:MM)
    const isValidTime = (time: string) => {
        const regex = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/;
        return regex.test(time);
    };

    // Function to submit the match
    const submitMatch = () => {
        if (!date || !time || !location) {
            alert('Please fill in all fields!'); // Validate that all fields are filled
            return;
        }

        if (!isValidDate(date)) {
            alert('Please enter a valid date in the format DD/MM/YYYY.'); // Validate that valid date format is inputted
            return;
        }

        if (!isValidTime(time)) {
            alert('Please enter a valid time in the format HH:MM.'); // Validate that valid time format is inputted
            return;
        }

        // Prepare the data to be sent in the POST request
        const formData = new URLSearchParams();
        formData.append('date', date);
        formData.append('time', time);
        formData.append('location', location);
        formData.append('team1_id', team1Id);

        // Make the POST request to create the match
        axios.post('http://192.168.0.160:5000/api/v1.0/matches', formData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        })
            .then(response => {
                if (response.status === 201) {
                    alert('Match added successfully!');
                    setDate('');
                    setTime('');
                    setLocation('');
                }
            })
            .catch(error => {
                console.error('Error submitting match:', error);
                alert('Failed to add match.');
            });
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <TouchableOpacity style={styles.backButton} onPress={backButton}>
                    <Text>{'<'}</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Create a new Match</Text>

                {/* Date */}
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Date:</Text>
                    <TextInput
                        style={styles.input}
                        value={date}
                        onChangeText={setDate}
                        placeholder="DD/MM/YYYY"
                        keyboardType="default"
                    />
                </View>

                {/* Time */}
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Time:</Text>
                    <TextInput
                        style={styles.input}
                        value={time}
                        onChangeText={setTime}
                        placeholder="12:00"
                        keyboardType="default"
                    />
                </View>

                {/* Location */}
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Location:</Text>
                    <TextInput
                        style={styles.input}
                        value={location}
                        onChangeText={setLocation}
                        placeholder="Enter location"
                        keyboardType="default"
                    />
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.addButton} onPress={submitMatch}>
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

export default NewMatch;
