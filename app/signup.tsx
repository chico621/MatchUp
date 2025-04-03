import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { backButton } from './apiFunctions';
import { router } from 'expo-router';

const SignUpScreen = () => {
    const [name, setName] = useState('');  // Add name state
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Function to handle the sign-up
    const handleSignUp = async () => {
        if (!name || !username || !email || !password) {  // Include name in the check
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        try {
            const formData = new URLSearchParams();
            formData.append('name', name);  // Append name
            formData.append('username', username);
            formData.append('email', email);
            formData.append('password', password);

            const response = await axios.post(
                'http://192.168.0.160:5000/api/v1.0/signup',
                formData.toString(),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                }
            );

            if (response.status === 201) {
                Alert.alert('Success', 'User registered successfully');
                router.replace('../signin');
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                // If it's an Axios error and has a response, show the backend error message
                Alert.alert('Error', error.response.data.error || 'Something went wrong');
            } else if (error instanceof Error) {
                // If it's a standard JS error, show its message
                Alert.alert('Error', error.message);
            } else {
                // If it's an unknown type of error, show a generic message
                Alert.alert('Error', 'Failed to sign up. Please try again.');
            }
        }
    };

    return (
        <SafeAreaView className="bg-white h-full">
            <ScrollView contentContainerClassName="h-full">
                <TouchableOpacity style={styles.backButton} onPress={backButton}>
                    <Text>{'<'}</Text>
                </TouchableOpacity>
                <View className="px-10">
                    <Text className="text-base text-center uppercase text-black">
                        Welcome to <Text className="font-bold">MatchUp</Text>
                    </Text>
                    <Text className="text-2xl font-bold text-center mt-2">
                        Lets get your account created.
                    </Text>

                    {/* Name */}
                    <TextInput
                        value={name}
                        onChangeText={setName}
                        placeholder="Enter your full name"
                        className="border-b-2 border-black my-4 p-2"
                    />

                    {/* Username */}
                    <TextInput
                        value={username}
                        onChangeText={setUsername}
                        placeholder="Enter your username"
                        className="border-b-2 border-black my-4 p-2"
                    />

                    {/* Email */}
                    <TextInput
                        value={email}
                        onChangeText={setEmail}
                        placeholder="Enter your email"
                        className="border-b-2 border-black my-4 p-2"
                    />

                    {/* Password */}
                    <TextInput
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Enter your password"
                        secureTextEntry
                        className="border-b-2 border-black my-4 p-2"
                    />

                    {/* Button */}
                    <TouchableOpacity onPress={handleSignUp} className="bg-white shadow-md shadow-zinc-300 rounded-full w-full py-4 mt-5">
                        <Text className="text-center">Create my account!</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
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
});

export default SignUpScreen;
