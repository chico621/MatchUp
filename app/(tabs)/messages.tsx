import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRouter } from 'expo-router';

const Messages = () => {
    const [userID, setUserID] = useState<string | null>(null);
    const [conversations, setConversations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    // Fetch userID from AsyncStorage
    useEffect(() => {
        const fetchUserID = async () => {
            try {
                const storedUserID = await AsyncStorage.getItem('userID');
                if (storedUserID) {
                    setUserID(storedUserID);
                } else {
                    setError('User ID not found in storage');
                    setLoading(false);
                }
            } catch (error) {
                console.error('Error fetching userID from AsyncStorage:', error);
                setError('Error fetching user ID');
                setLoading(false);
            }
        };

        fetchUserID();
    }, []);

    // Fetch conversations by using the userID of the logged-in user
    useEffect(() => {
        const fetchConversations = async () => {
            if (userID) {
                try {
                    const response = await axios.get(
                        `http://192.168.0.160:5000/api/v1.0/conversations/${userID}`
                    );
                    if (response.status === 200) {
                        setConversations(response.data);
                    } else {
                        setError('Failed to fetch conversations');
                    }
                } catch (error) {
                    console.error('Error fetching conversations:', error);
                    setError('Error fetching conversations');
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        if (userID) {
            fetchConversations();
        }
    }, [userID]);

    const fetchConversation = (conversationId: string) => {
        if (conversationId) {
            router.push(`../conversations/${conversationId}`);
        } else {
            console.error('Conversation ID is undefined');
        }
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (error) {
        return <Text>{error}</Text>;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Your Conversations</Text>
            <TouchableOpacity style={styles.addButton}>
                <Text>+</Text>
            </TouchableOpacity>
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
                                        {participants.join(', ')}
                                    </Text>
                                    <Text style={styles.conversationDate}>
                                        Last updated: {item.last_updated_at}
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    header: {
        marginTop: 50,
        padding: 10,
        fontSize: 25,
        fontWeight: 'bold',
    },
    conversationItem: {
        backgroundColor: '#fff',
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
    },
    conversationDate: {
        fontSize: 14,
        color: '#555',
    },
    messagePreview: {
        fontSize: 16,
        color: '#888',
    },
    addButton: {
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
        position: 'absolute',
        top: 10,
        right: 10,
        marginTop: 50,
    },
});

export default Messages;
