import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { useLocalSearchParams } from 'expo-router';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { backButton } from '../apiFunctions';

const ConversationDetails = () => {
    const { conversationId } = useLocalSearchParams(); // Get conversationId from URL params
    const [conversation, setConversation] = useState<any>(null); // To store conversation data
    const [newMessage, setNewMessage] = useState<string>(''); // To store new message text
    const [usernames, setUsernames] = useState<Record<string, string>>({}); // To store mapping of userID to username

    // Fetch conversation and user names
    useEffect(() => {
        if (conversationId) {
            axios.get(`http://192.168.0.160:5000/api/v1.0/viewconversation/${conversationId}`)
                .then(response => {
                    setConversation(response.data);
                    fetchUsernames(response.data.messages);
                })
                .catch(error => console.error('Error fetching conversation:', error));
        }
    }, [conversationId]);

    // Fetch usernames for each sender_id
    const fetchUsernames = async (messages: any[]) => {
        const uniqueUserIds = Array.from(new Set(messages.map((msg: any) => msg.sender_id)));
        const usernamePromises = uniqueUserIds.map((userId: string) =>
            axios.get(`http://192.168.0.160:5000/api/v1.0/users/${userId}`)
                .then(response => ({ userId, username: response.data.username }))
                .catch(error => console.error(`Error fetching username for ${userId}:`, error))
        );

        const usernameResponses = await Promise.all(usernamePromises);
        const newUsernames = usernameResponses.reduce((acc: Record<string, string>, { userId, username }: any) => {
            acc[userId] = username;
            return acc;
        }, {});
        setUsernames(newUsernames);
    };

    // Function to send a new message

    const sendMessage = async () => {
        if (!newMessage.trim()) return;

        try {
            // Retrieve user_id from AsyncStorage
            const user_id = await AsyncStorage.getItem('userID');
            if (!user_id) {
                console.error("No user ID found in storage");
                return;
            }

            const messageData = {
                sender_id: user_id,  // Use the retrieved user_id
                message_text: newMessage,
                sent_at: new Date().toISOString(),
            };

            await axios.post(`http://192.168.0.160:5000/api/v1.0/sendmessage/${conversationId}`, messageData); // Send message endpoint
            setConversation((prev: any) => ({
                ...prev,
                messages: [...prev.messages, messageData],
            }));
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    // Function to handle conversation deletion

    const handleDeleteConversation = () => {
        Alert.alert(
            'Delete Conversation',
            'Are you sure you want to delete this conversation?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    onPress: async () => {
                        try {
                            const response = await axios.delete(`http://192.168.0.160:5000/api/v1.0/conversations/${conversationId}`); // Delete conversation endpoint
                            if (response.status === 204) {
                                Alert.alert('Success', 'Conversation deleted');
                                backButton(); // Navigate back after delete
                            } else {
                                Alert.alert('Error', 'Failed to delete conversation');
                            }
                        } catch (error) {
                            console.error('Error deleting conversation:', error);
                            Alert.alert('Error', 'Failed to delete conversation');
                        }
                    },
                },
            ],
            { cancelable: true }
        );
    };

    return (
        <KeyboardAwareScrollView style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={backButton}>
                <Text>{'<'}</Text>
            </TouchableOpacity>
            <Text style={styles.header}>Conversation</Text>

            {conversation ? (
                <ScrollView style={styles.messagesContainer}>
                    {conversation.messages.length > 0 ? (
                        conversation.messages.map((msg: any, index: number) => (
                            <View key={index} style={styles.message}>
                                <Text style={styles.sender}>
                                    From: {usernames[msg.sender_id] || msg.sender_id}
                                </Text>
                                <Text>{msg.message_text}</Text>
                                <Text style={styles.timestamp}>{msg.sent_at}</Text>
                            </View>
                        ))
                    ) : (
                        <Text style={styles.noMessage}>No message history, Why not send this person a message?</Text>
                    )}
                </ScrollView>
            ) : (
                <Text>No conversation data available.</Text>
            )}

            {/* Input field for new message and send button */}

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={newMessage}
                    onChangeText={setNewMessage}
                    placeholder="Type a message"
                />
                <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                    <Text style={styles.sendButtonText}>Send</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteConversation}>
                <Text style={styles.deleteButtonText}>Delete Conversation</Text>
            </TouchableOpacity>
        </KeyboardAwareScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#424242'
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 20,
        marginTop: 50
    },
    messagesContainer: {
        marginTop: 20
    },
    message: {
        marginBottom: 15,
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 8
    },
    noMessage: {
        padding: 20,
        marginBottom: 20,
    },
    sender: {
        fontWeight: 'bold'
    },
    timestamp: {
        fontSize: 12,
        color: '#888'
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 20
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 20,
        padding: 10,
        color: 'black',
        backgroundColor: 'white',
        marginRight: 10
    },
    sendButton: {
        backgroundColor: '#007bff',
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 20
    },
    sendButtonText: {
        color: 'white',
        fontWeight: 'bold'
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
    deleteButton: {
        marginTop: 20,
        backgroundColor: '#ff4d4d',
        paddingVertical: 10,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center'
    },
    deleteButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default ConversationDetails;
