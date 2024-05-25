import React, { useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, ScrollView, Image, Linking, Platform } from 'react-native';

const ResourcesScreen = () => {
    const emergencyNumbers = [
        { name: 'Assault Hotline', number: '714-580-7065', icon: require('../public/assets/icon-helpline.png') },
        { name: 'Police', number: '714-580-7065', icon: require('../public/assets/icon-police.png') },
        { name: 'Local Ambulance', number: '714-580-7065', icon: require('../public/assets/icon-ambulance.png') }
    ];

    const [expandedId, setExpandedId] = useState(null);

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
        <ImageBackground source={require('../public/assets/plain-background.png')} style={styles.background}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.emergencySection}>
                    <Text style={styles.header}>Emergency Numbers</Text>
                    {emergencyNumbers.map((item, index) => (
                        <TouchableOpacity key={index} onPress={() => makeCall(item.number)} style={styles.item}>
                            <Image source={item.icon} style={styles.iconStyle} />
                            <Text style={styles.itemText}>{item.name}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.safetySection}>
                    <Text style={styles.header}>Safety Measures in case of Emergencies</Text>
                    {safetyMeasures.map(measure => (
                        <TouchableOpacity key={measure.id} onPress={() => toggleExpand(measure.id)} style={styles.item}>
                            <Text style={styles.itemText}>{measure.title}</Text>
                            {expandedId === measure.id && (
                                <View style={styles.expandedSection}>
                                    <Text style={styles.description}>{measure.description}</Text>
                                    {measure.points.map((point, idx) => (
                                        <Text key={idx} style={styles.bulletPoint}>• {point}</Text>
                                    ))}
                                </View>
                            )}
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    container: {
        padding: 20,
        paddingTop: 150,
    },
    emergencySection: {
        backgroundColor: '#F6F7B0',
        padding: 20,
        borderRadius: 10,
        marginBottom: 20,
        opacity: 0.9,
    },
    safetySection: {
        backgroundColor: '#E9E4F9',
        padding: 20,
        borderRadius: 10,
        marginBottom: 20,
        opacity: 0.9,
    },
    nearestSection: {
        backgroundColor: '#F2B7B7',
        padding: 20,
        borderRadius: 10,
        marginBottom: 20,
        opacity: 0.9,
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    item: {
        flexDirection: 'row',  // Align items in a row
        alignItems: 'center',  // Center items vertically
        padding: 10,
        
        marginBottom: 10,
    },
    itemText: {
        fontSize: 18,
        color: '#17156F'
    },
    iconStyle: {
        width: 25, // Set width of the icon
        height: 25, // Set height of the icon
        marginRight: 10, // Add some margin to the right of the icon
    },
    expandedSection: {
        marginTop: 5,
    },
    description: {
        fontSize: 14,
        color: '#333',
        marginBottom: 5,  // Margin bottom to space out the description from the bullet points
    },
    bulletPoint: {
        fontSize: 14,
        color: '#666',  // Slightly lighter text color for bullet points
        paddingLeft: 10,  // Padding left to align text nicely under the bullet point
    }
});

export default ResourcesScreen;
