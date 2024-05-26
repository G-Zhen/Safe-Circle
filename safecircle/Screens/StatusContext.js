import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import * as SMS from 'expo-sms';
import { Alert } from 'react-native';

export const StatusContext = createContext();

export const StatusProvider = ({ children }) => {
    const [status, setStatus] = useState('Safe');
    const [statusColor, setStatusColor] = useState('#92BDA6');

    const toggleStatus = async () => {
        if (status === 'Safe') {
            setStatus('Feeling Unsafe');
            setStatusColor('#F2B7B7');
            await sendAlertToPinnedContacts();
        } else {
            setStatus('Safe');
            setStatusColor('#92BDA6');
        }
    };

    const sendAlertToPinnedContacts = async () => {
        try {
            // Get pinned contacts from AsyncStorage
            const pinnedContacts = await AsyncStorage.getItem('pinnedContacts');
            const contacts = pinnedContacts ? JSON.parse(pinnedContacts) : [];

            // Request location permissions
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission to access location was denied');
                return;
            }

            // Get current location
            let location = await Location.getCurrentPositionAsync({});
            const { latitude, longitude } = location.coords;
            const locationMessage = `This ALERT is from SafeCircle: I am feeling unsafe, here is my current location: https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

            // Send SMS to each pinned contact separately
            for (const contact of contacts) {
                for (const phoneNumber of contact.phoneNumbers) {
                    if (await SMS.isAvailableAsync()) {
                        await SMS.sendSMSAsync([phoneNumber], locationMessage);
                    } else {
                        Alert.alert('SMS is not available on this device');
                    }
                }
            }
        } catch (error) {
            console.error('Error sending alert:', error);
            Alert.alert('Error', 'An error occurred while trying to send the alert');
        }
    };

    return (
        <StatusContext.Provider value={{ status, statusColor, toggleStatus }}>
            {children}
        </StatusContext.Provider>
    );
};
