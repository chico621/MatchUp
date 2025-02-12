import { View, Text, ScrollView, SafeAreaView, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { backButton } from "../apiFunctions";
import { useState } from 'react';
import axios from 'axios';
import React from 'react';

const NewMatch = () => {
    // State to hold user input
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [location, setLocation] = useState('');

    const submitMatch = () => {
        if (!date || !time || !location) {
            alert('Please fill in all fields!');
            return;
        }

        const formData = new URLSearchParams();
        formData.append('date', date);
        formData.append('time', time);
        formData.append('location', location);

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
            });
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <TouchableOpacity style={styles.backButton} onPress={backButton}>
                    <Text>{'<'}</Text>
                </TouchableOpacity>
                <Text style={styles.titleHeader}>Create a new Match</Text>

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

                {/* Time  */}
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
    titleHeader: {
        fontSize: 20,
        textAlign: 'center',
    },
    inputContainer: {
        marginBottom: 20,
        paddingHorizontal: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
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
