import axios from 'axios';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.0.160:5000/api/v1.0/matches';

// Fetch all matches

export const backButton = () => {
    router.back();
};

export const isUserLoggedIn = async (): Promise<boolean> => {
    try {
        const token = await AsyncStorage.getItem('authToken'); // Get the JWT from memory
        return !!token;
    } catch (error) {
        console.error('Error checking login status:', error);
        return false;
    }
};

export const fetchMatches = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching matches:', error);
        return [];
    }
};

// Delete a match
export const deleteMatch = async (matchId: string) => {
    try {
        await axios.delete(`${API_URL}/${matchId}`);
        fetchMatches(); // Refresh the list after deletion
        router.back(); // Navigate back to the previous screen
    } catch (error) {
        console.error('Error deleting match:', error);
    }
};

