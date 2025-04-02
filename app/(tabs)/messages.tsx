import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useIsFocused } from '@react-navigation/native';

const Messages = () => {
    const [userID, setUserID] = useState<string | null>(null);
    const [conversations, setConversations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const isFocused = useIsFocused();  // Hook to check if the screen is focused

    // Fetch userID from AsyncStorage
    useEffect(() => {
        const fetchUserID = async () => {
            try {
                const storedUserID = await AsyncStorage.getItem('userID'); // Get userID from AsyncStorage
                if (storedUserID) {
                    setUserID(storedUserID); // Set userID state
                } else {
                    setError('User ID not found in storage'); // Handle case where userID is not found
                    setLoading(false);
                }
            } catch (error) {
                console.error('Error fetching userID from AsyncStorage:', error); // Handle error
                setError('Error fetching user ID');
                setLoading(false);
            }
        };

        fetchUserID();
    }, []);

    // Fetch conversations when the userID is set or the screen is focused
    useEffect(() => {
        const fetchConversations = async () => {
            if (userID) {
                try {
                    const response = await axios.get(
                        `http://192.168.0.160:5000/api/v1.0/conversations/${userID}` // Fetch conversations for the user
                    );
                    if (response.status === 200) { // Check if the response is successful
                        setConversations(response.data);
                    } else {
                        setError('Failed to fetch conversations'); // Handle non-200 responses
                    }
                } catch (error) {
                    console.error('Error fetching conversations:', error);
                    setError('Error fetching conversations');
                } finally {
                    setLoading(false);
                }
            }
        };

        if (userID || isFocused) {
            fetchConversations();
        } else {
            setLoading(false); // Stop loading if userID is not found
        }
    }, [userID, isFocused]);  // Refresh when the screen is focused or userID is set

    // Function to update the list of conversations after a conversation is deleted
    /* const updateConversations = (conversationId: string) => {
     setConversations((prevConversations) =>
            prevConversations.filter((conversation) => conversation.conversation_id !== conversationId)
        );
    }; */

    const fetchConversation = (conversationId: string) => {
        if (conversationId) {
            router.push(`../conversations/${conversationId}`); // Navigate to the conversation details
        } else {
            console.error('Conversation ID is undefined');
        }
    };

    if (loading) { // Loading state
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="black" />
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        );
    }

    if (error) { // Error state, will alow the user to retry fetching
        return (
            <View style={styles.centered}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity onPress={() => setLoading(true)} style={styles.retryButton}>
                    <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Your Conversations</Text>
            <TouchableOpacity style={styles.addButton} onPress={() => router.push('../conversations/newConversation')}>
                <Text>+</Text>
            </TouchableOpacity>

            {/* Display conversations */}

            {conversations.length > 0 ? (
                <ScrollView>
                    {conversations.map((item) => {
                        const participants = item.participants.filter(
                            (participant: string) => participant !== userID
                        );

                        return (
                            <TouchableOpacity key={item.conversation_id} onPress={() => fetchConversation(item.conversation_id)}>
                                <View style={styles.conversationItem}>
                                    <Text style={styles.conversationTitle}>
                                        {item.conversation_name}
                                    </Text>
                                    <Text style={styles.conversationDate}>
                                        {item.last_updated_at}
                                    </Text>
                                    <Text style={styles.messagePreview}>
                                        {item.messages.length > 0
                                            ? item.messages[0].message_text
                                            : 'No messages yet'}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            ) : (
                <Text>No conversations found.</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({ // Styles for the component
    container: {
        flex: 1,
        backgroundColor: '#424242',
        padding: 10,
    },
    header: {
        marginTop: 50,
        padding: 10,
        fontSize: 25,
        fontWeight: 'bold',
        color: '#fff',
    },
    conversationItem: {
        backgroundColor: '#585858',
        padding: 10,
        margin: 5,
        borderRadius: 8,
        elevation: 5,
        shadowOpacity: 0.2,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        shadowColor: '#000',
    },
    conversationTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    conversationDate: {
        fontSize: 14,
        color: 'grey',
    },
    messagePreview: {
        fontSize: 16,
        color: 'black',
    },
    addButton: {
        width: 30,
        height: 30,
        borderRadius: 20,
        backgroundColor: '#7f7f7f',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 10,
        right: 10,
        marginTop: 50,
    },
    retryButton: {
        backgroundColor: '#C24C43',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 50,
        marginTop: 20,
    },
    retryButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    loadingText: {
        marginTop: 20,
        color: '#fff',
        fontSize: 18,
    },
    errorText: {
        color: 'red',
        fontSize: 18,
        textAlign: 'center',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#424242',
    },
});

export default Messages;
