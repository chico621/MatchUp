import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useLocalSearchParams } from 'expo-router';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { backButton } from '../apiFunctions';

const ConversationDetails = () => {
    const { conversationId } = useLocalSearchParams();
    const [conversation, setConversation] = useState<any>(null);
    const [newMessage, setNewMessage] = useState<string>('');

    useEffect(() => {
        if (conversationId) {
            axios.get(`http://192.168.0.160:5000/api/v1.0/viewconversation/${conversationId}`)
                .then(response => setConversation(response.data))
                .catch(error => console.error('Error fetching conversation:', error));
        }
    }, [conversationId]);

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

            await axios.post(`http://192.168.0.160:5000/api/v1.0/sendmessage/${conversationId}`, messageData);
            setConversation((prev: any) => ({
                ...prev,
                messages: [...prev.messages, messageData],
            }));
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <KeyboardAwareScrollView style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={backButton}>
                <Text>{'<'}</Text>
            </TouchableOpacity>
            <Text style={styles.header}>Conversation Details</Text>
            {conversation ? (
                <ScrollView style={styles.messagesContainer}>
                    {conversation.messages.length > 0 ? (
                        conversation.messages.map((msg: any, index: number) => (
                            <View key={index} style={styles.message}>
                                <Text style={styles.sender}>From: {msg.sender_id}</Text>
                                <Text>{msg.message_text}</Text>
                                <Text style={styles.timestamp}>{msg.sent_at}</Text>
                            </View>
                        ))
                    ) : (
                        <Text>No messages in this conversation.</Text>
                    )}
                </ScrollView>
            ) : (
                <Text>No conversation data available.</Text>
            )}

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
        </KeyboardAwareScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: 'white' },
    header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, marginTop: 50 },
    messagesContainer: { marginTop: 20 },
    message: { marginBottom: 15, padding: 10, backgroundColor: '#f9f9f9', borderRadius: 8 },
    sender: { fontWeight: 'bold' },
    timestamp: { fontSize: 12, color: '#888' },
    inputContainer: { flexDirection: 'row', alignItems: 'center', paddingBottom: 20 },
    input: { flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 20, padding: 10, marginRight: 10 },
    sendButton: { backgroundColor: '#007bff', borderRadius: 20, paddingVertical: 10, paddingHorizontal: 20 },
    sendButtonText: { color: 'white', fontWeight: 'bold' }, backButton: {
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
});

export default ConversationDetails;