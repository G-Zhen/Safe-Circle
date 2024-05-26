import React, { useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, ScrollView, Image, Linking, Platform, ActivityIndicator } from 'react-native';
import Header from './Header'; // Adjust the path as needed
import TabBar from './TabBar'; 

const ResourcesScreen = () => {
    const emergencyNumbers = [
        { name: 'Assault Hotline', number: '714-580-7065', icon: require('../public/assets/icon-helpline.png') },
        { name: 'Police', number: '714-580-7065', icon: require('../public/assets/icon-police.png') },
        { name: 'Local Ambulance', number: '714-580-7065', icon: require('../public/assets/icon-ambulance.png') }
    ];

    const [expandedId, setExpandedId] = useState(null);
    const [isImageLoaded, setIsImageLoaded] = useState(false);

    const safetyMeasures = [
        { id: 'theft', title: 'Theft', points: ['Do not leave belongings unattended.', 'Use secure locks.', 'Be aware of your surroundings.'] },
        { id: 'sexualAssault', title: 'Sexual Assault', points: ['Contact authorities immediately.', 'Seek medical attention.', 'Reach out to support groups.'] },
        { id: 'stalking', title: 'Stalking', points: ['Keep evidence of stalking.', 'Inform the police.', 'Consider a restraining order.'] },
        { id: 'kidnapping', title: 'Kidnapping', points: ['Stay in well-lit areas.', 'Always inform others of your whereabouts.', 'Use safety apps.'] },
        { id: 'ambushed', title: 'Ambushed', points: ['Stay calm and assess the situation.', 'Look for escape routes.', 'Use self-defense as a last resort.'] },
    ];

    const makeCall = (number) => {
        let phoneNumber = '';
        if (Platform.OS === 'android') {
            phoneNumber = `tel:${number}`;
        } else {
            phoneNumber = `telprompt:${number}`;
        }
        Linking.openURL(phoneNumber);
    };

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <View style={styles.container}>
            <ImageBackground
                source={require('../public/assets/plain-background.png')}
                style={styles.background}
                resizeMode="cover"
                onLoad={() => setIsImageLoaded(true)}
            >
                {!isImageLoaded && (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#0000ff" />
                    </View>
                )}
                {isImageLoaded && (
                    <View style={styles.innerContainer}>
                        <Header title="Resources" />
                        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
                            <View style={styles.emergencySection}>
                                <Text style={styles.header}>Emergency Numbers</Text>
                                {emergencyNumbers.map((item, index) => (
                                    <TouchableOpacity key={index} onPress={() => makeCall(item.number)} style={styles.emergencyItem}>
                                        <Image source={item.icon} style={styles.iconStyle} />
                                        <Text style={styles.emergencyItemText}>{item.name}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <View style={styles.safetySection}>
                                <Text style={styles.header}>Safety Measures in case of Emergencies</Text>
                                {safetyMeasures.map(measure => (
                                    <View key={measure.id} style={styles.item}>
                                        <TouchableOpacity onPress={() => toggleExpand(measure.id)} style={styles.titleContainer}>
                                            <Image
                                                source={expandedId === measure.id
                                                    ? require('../public/assets/icon-down-arrow.png')
                                                    : require('../public/assets/icon-right-arrow.png')}
                                                style={styles.arrowIcon}
                                            />
                                            <Text style={styles.itemText}>{measure.title}</Text>
                                        </TouchableOpacity>
                                        {expandedId === measure.id && (
                                            <View style={styles.expandedSection}>
                                                {measure.points.map((point, idx) => (
                                                    <Text key={idx} style={styles.bulletPoint}>• {point}</Text>
                                                ))}
                                            </View>
                                        )}
                                    </View>
                                ))}
                            </View>
                        </ScrollView>
                        <TabBar />
                    </View>
                )}
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    innerContainer: {
        flex: 1,
        paddingBottom: 100,
    },
    scrollViewContainer: {
        padding: 15,
    },
    loadingContainer: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -50 }, { translateY: -50 }],
    },
    emergencySection: {
        backgroundColor: '#F6F7B0',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        opacity: 0.9,
    },
    safetySection: {
        backgroundColor: '#E9E4F9',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        opacity: 0.9,
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center', // Center the header text
    },
    item: {
        marginBottom: 10,
    },
    titleContainer: {
        flexDirection: 'row',  // Align items in a row
        alignItems: 'center',  // Center items vertically
        padding: 5,
    },
    emergencyItem: {
        flexDirection: 'row',  // Align items in a row
        alignItems: 'left',  // Align items to the left
        padding: 5,
        marginBottom: 10,
    },
    emergencyItemText: {
        fontSize: 18,
        color: '#17156F',
        marginLeft: 10, // Add margin to the left of the emergency item text
        textAlign: 'left',
        fontWeight: 'bold',
        fontStyle: 'italic',
    },
    itemText: {
        fontSize: 18,
        color: '#17156F',
        fontWeight: 'semibold',
        fontStyle: 'italic',
    },
    iconStyle: {
        width: 25, // Set width of the icon
        height: 25, // Set height of the icon
    },
    arrowIcon: {
        width: 25,
        height: 25,
        marginRight: 10,
    },
    expandedSection: {
        marginTop: 5,
        paddingLeft: 25, // Add padding to align with text nicely
    },
    bulletPoint: {
        fontSize: 16,
        color: '#666',  // Slightly lighter text color for bullet points
        paddingLeft: 5,  // Padding left to align text nicely under the bullet point
    },
});

export default ResourcesScreen;