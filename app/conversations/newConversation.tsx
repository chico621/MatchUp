import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { backButton } from '../apiFunctions';

const NewConversation = () => {
    const [participants, setParticipants] = useState<string[]>([]); // To store selected participants
    const [users, setUsers] = useState<any[]>([]); // To store all users
    const [filteredUsers, setFilteredUsers] = useState<any[]>([]); // To store filtered users
    const [loading, setLoading] = useState(true); // Loading state
    const [searchQuery, setSearchQuery] = useState(''); // State for search query
    const [conversationName, setConversationName] = useState('');  // State for conversation name
    const router = useRouter(); // Router for navigation

    // Fetch all users
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://192.168.0.160:5000/api/v1.0/users');
                if (response.status === 200) {
                    setUsers(response.data);
                    setFilteredUsers(response.data); // Initially show all users
                } else {
                    Alert.alert('Error', 'Failed to fetch users');
                }
            } catch (error) {
                console.error('Error fetching users:', error);
                Alert.alert('Error', 'Could not load users.');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    // Handle adding participant by clicking a user
    const addParticipant = (userID: string) => {
        if (!participants.includes(userID)) {
            setParticipants([...participants, userID]);
        }
    };

    // Handle search functionality
    const handleSearch = (text: string) => {
        setSearchQuery(text);
        const filtered = users.filter(user =>
            user.username.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredUsers(filtered);
    };

    // Create conversation
    const createConversation = async () => {
        const userID = await AsyncStorage.getItem('userID');
        if (!userID) {
            Alert.alert('Error', 'User ID not found.'); // Checks if userID is retrieved
            return;
        }

        if (participants.length === 0) {
            Alert.alert('Error', 'Please select at least one participant.'); // Check if participants are selected
            return;
        }

        if (conversationName.trim() === '') {
            Alert.alert('Error', 'Please provide a conversation name.'); // Check if conversation name is empty
            return;
        }

        try {
            const response = await axios.post('http://192.168.0.160:5000/api/v1.0/conversations', { // Create conversation endpoint
                conversation_name: conversationName,  // Send conversation name
                participants: [userID, ...participants],
            });

            if (response.status === 201 || response.status === 200) {
                Alert.alert('Success', 'Conversation created.');
                router.replace('/messages');
            }
        } catch (error) {
            console.error('Error creating conversation:', error);
            Alert.alert('Error', 'Failed to create conversation.');
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={backButton}>
                <Text>{'<'}</Text>
            </TouchableOpacity>
            <Text style={styles.header}>Start a New Conversation</Text>

            {/* Conversation Name */}
            <Text style={styles.label}>Conversation Name:</Text>
            <TextInput
                style={styles.input}
                value={conversationName}
                onChangeText={setConversationName}  // Update the conversation name
                placeholder="Enter conversation name"
                placeholderTextColor="#bbb"
            />

            {/* Selected Participants */}
            <Text style={styles.label}>Selected Participants:</Text>
            <Text style={styles.participants}>{participants.join(', ') || 'None'}</Text>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    value={searchQuery}
                    onChangeText={handleSearch}  // Automatically update on text change
                    placeholder="Search users..."
                    placeholderTextColor="#bbb"
                />
            </View>

            {/* User List */}
            <ScrollView style={styles.userList}>
                {loading ? (
                    <Text style={styles.loadingText}>Loading users...</Text>
                ) : (
                    filteredUsers.map((user) => (
                        <TouchableOpacity
                            key={user._id}  // Changed to use _id for uniqueness
                            style={styles.userItem}
                            onPress={() => addParticipant(user._id)} // Updated to use _id
                        >
                            <Text style={styles.userName}>{user.username}</Text>
                        </TouchableOpacity>
                    ))
                )}
            </ScrollView>

            {/* Create Conversation Button */}
            <TouchableOpacity style={styles.button} onPress={createConversation}>
                <Text style={styles.buttonText}>Create</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#424242',
        padding: 20,
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
        marginTop: 50,
        marginBottom: 10,
    },
    label: {
        fontSize: 16,
        color: '#fff',
        marginTop: 10,
    },
    participants: {
        fontSize: 16,
        color: '#bbb',
        marginBottom: 10,
    },
    input: {
        padding: 10,
        borderRadius: 8,
        backgroundColor: '#777',
        color: '#fff',
        marginBottom: 15,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
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
    searchInput: {
        flex: 1,
        padding: 10,
        borderRadius: 8,
        backgroundColor: '#777',
        color: '#fff',
        marginRight: 10,
    },
    userList: {
        maxHeight: 300,
        backgroundColor: '#585858',
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
    },
    loadingText: {
        color: '#fff',
        textAlign: 'center',
    },
    userItem: {
        padding: 10,
        backgroundColor: '#777',
        marginVertical: 5,
        borderRadius: 8,
    },
    userName: {
        fontSize: 16,
        color: '#fff',
    },
    button: {
        backgroundColor: '#C24C43',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
    },
});

export default NewConversation;
