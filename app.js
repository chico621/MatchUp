import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import axios from 'axios';

const App = () => {
    const [matches, setMatches] = useState([]);
    const [newMatchLink, setNewMatchLink] = useState('');

    useEffect(() => {
        // Fetch all matches
        axios.get('http://127.0.0.1:5000/api/v1.0/matches')
            .then(response => {
                setMatches(response.data);
            })
            .catch(error => {
                console.error('Error fetching matches:', error);
            });
    }, []);

    const addMatch = () => {
        axios.post('http://127.0.0.1:5000/api/v1.0/matches', {
            date: '2025-01-23', // example date
            time: '14:00',      // example time
            location: 'Stadium A' // example location
        })
            .then(response => {
                setNewMatchLink(response.data.url);
            })
            .catch(error => {
                console.error('Error adding match:', error);
            });
    };
};

export default App;
