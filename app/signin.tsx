import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { backButton } from './apiFunctions';
import { useRouter } from 'expo-router';

const SignIn = () => {
    const [username, setUsername] = useState('');  // Stores username 
    const [password, setPassword] = useState('');  // Stores password
    const [errorMessage, setErrorMessage] = useState('');  // To show error message
    const router = useRouter();

    const handleLogin = async () => {
        try {
            const response = await axios.get('http://192.168.0.160:5000/api/v1.0/login', {
                auth: {
                    username: username,
                    password: password,
                }
            });


            // If login is successful, the JWT is then stored in memory
            const token = response.data.token;
            await AsyncStorage.setItem('authToken', token);
            console.log('Logged in successfully, token:', token);
            router.back();


        } catch (error) {
            setErrorMessage('Invalid username or password.');
            console.log('Login error:', error);
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
                    <Text className="text-3xl font-bold text-center mt-2">
                        Let's do the boring stuff first.
                    </Text>

                    {/* Email input */}
                    <TextInput
                        value={username}
                        onChangeText={setUsername}
                        placeholder="Enter your username"
                        className="border-b-2 border-black my-4 p-2"
                    />

                    {/* Password input */}
                    <TextInput
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Enter your password"
                        secureTextEntry
                        className="border-b-2 border-black my-4 p-2"
                    />

                    {/* Error message */}
                    {errorMessage && <Text className="text-red-500 text-center">{errorMessage}</Text>}

                    {/* Buttons */}
                    <TouchableOpacity onPress={handleLogin} className="bg-white shadow-md shadow-zinc-300 rounded-full w-full py-4 mt-5">
                        <Text className="text-center">Login</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.replace('./signup')} className="bg-white shadow-md shadow-zinc-300 rounded-full w-full py-4 mt-5">
                        <Text className="text-center">Sign Up</Text>
                    </TouchableOpacity>
                    {/* You can also add Signup or Google login buttons */}
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
export default SignIn;
