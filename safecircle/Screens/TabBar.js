import React, { useEffect } from 'react';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import { StyleSheet, View, Text, TouchableOpacity, Image, Alert, Linking } from 'react-native';
import * as Location from 'expo-location';

const TabBar = () => {
    const navigation = useNavigation();
    const navigationState = useNavigationState(state => state);

    const tabs = [
        { id: 'LocationTracking', label: 'Explore', icon: require('../public/assets/icon-location.png') },
        { id: 'Contacts', label: 'Contacts', icon: require('../public/assets/icon-contact.png') },
        { id: 'Resources', label: 'Resource', icon: require('../public/assets/icon-resources.png') },
        { id: 'Profile', label: 'Profile', icon: require('../public/assets/icon-mark.png') },
    ];

    const [activeTab, setActiveTab] = React.useState(tabs[0].id);

    useEffect(() => {
        const currentRouteName = navigationState.routes[navigationState.index].name;
        setActiveTab(currentRouteName);
    }, [navigationState]);

    const handleTabChange = (route) => {
        setActiveTab(route);
        navigation.navigate(route);
    };

    const getLocationAndSendText = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission to access location was denied');
            return;
        }

        let location = await Location.getCurrentPositionAsync({});
        const message = `This is an ALERT from SafeCircle: I am in Danger, and here is my latest location: https://maps.google.com/?q=${location.coords.latitude},${location.coords.longitude}`;

        Linking.openURL(`sms:9499924915&body=${encodeURIComponent(message)}`);
    };

    const handleSOSPress = () => {
        Alert.alert(
            'SOS pressed',
            'What action would you like to take?',
            [
                {
                    text: 'Call 911',
                    onPress: () => Linking.openURL('tel:9499924915'),
                },
                {
                    text: 'Text my location',
                    onPress: getLocationAndSendText,
                },
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
            ],
            { cancelable: true }
        );
    };

    return (
        <View style={styles.tabContainer}>
            {tabs.slice(0, 2).map(tab => (
                <TouchableOpacity
                    key={tab.id}
                    style={styles.tab}
                    onPress={() => handleTabChange(tab.id)}
                >
                    <Image source={tab.icon} style={styles.iconStyle} />
                    <Text style={[styles.tabText, activeTab === tab.id && styles.activeTabText]}>
                        {tab.label}
                    </Text>
                </TouchableOpacity>
            ))}
            <TouchableOpacity
                key="SOS"
                style={styles.sosButton}
                onPress={handleSOSPress}
            >
                <Text style={styles.sosButtonText}>SOS</Text>
            </TouchableOpacity>
            {tabs.slice(2).map(tab => (
                <TouchableOpacity
                    key={tab.id}
                    style={styles.tab}
                    onPress={() => handleTabChange(tab.id)}
                >
                    <Image source={tab.icon} style={styles.iconStyle} />
                    <Text style={[styles.tabText, activeTab === tab.id && styles.activeTabText]}>
                        {tab.label}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#E9E4F9',
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        padding: 10
    },
    iconStyle: {
        width: 25,
        height: 25,
        marginBottom: 5, // Space between icon and text
    },
    tabText: {
        color: 'black',
        fontWeight: 'bold',
    },
    activeTabText: {
        color: '#7976CB', // Active tab text color
        fontWeight: 'bold',
    },
    sosButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 5,
        marginHorizontal: 10,
        borderWidth: 3,
    },
    sosButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
    },
});

export default TabBar;