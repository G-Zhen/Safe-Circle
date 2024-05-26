import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { StatusContext } from './StatusContext';

const Header = ({ title }) => {
    const { status, statusColor, toggleStatus } = useContext(StatusContext);

    return (
        <View style={styles.headerContainer}>
            <View style={styles.textContainer}>
                <Text style={styles.pageHeader}>{title}</Text>
                <TouchableOpacity onPress={toggleStatus} style={[styles.statusButton, { backgroundColor: statusColor }]}>
                    <Text style={styles.statusText}>{`Status: ${status}`}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        marginTop: 80,
        padding: 15,
        paddingRight: 30,
    },
    textContainer: {
        alignItems: 'flex-end', // Aligns text and button to the right
    },
    pageHeader: {
        fontSize: 20,
        paddingBottom: 10,
        fontWeight: '600',
        textAlign: 'center',
        paddingRight: 30,
        color: '#F6F7B0',
    },
    statusButton: {
        padding: 10,
        width: 200,
        borderRadius: 30,
        marginTop: 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3
    },
    statusText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black', // Text color always black
    },
});

export default Header;