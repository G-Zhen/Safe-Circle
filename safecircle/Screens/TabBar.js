import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Tabs, TabList, Tab } from '@chakra-ui/react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Image } from 'react-native';

const TabBar = () => {
    const navigation = useNavigation();

    const tabs = [
        { id: 'Explore', label: 'Explore', icon: require('../public/assets/icon-location.png') },
        { id: 'Contacts', label: 'Contacts', icon: require('../public/assets/icon-contact.png') },
        { id: 'Resources', label: 'Resources', icon: require('../public/assets//icon-resources.png') },
        { id: 'Profile', label: 'Profile', icon: require('../public/assets/icon-mark.png') },
        { id: 'Settings', label: 'Settings', icon: require('../public/assets/icon-setting.png') },
    ];    

    const [activeTab, setActiveTab] = React.useState(tabs[0].id);

    const handleTabChange = (route) => {
        setActiveTab(route);
        navigation.navigate(route);
    };

    return (
        <View style={styles.tabContainer}>
            {tabs.map(tab => (
                <TouchableOpacity
                    key={tab.id}
                    style={[styles.tab, activeTab === tab.id && styles.activeTab]}
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
      padding: 10,
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
      color: '#17156F',
      fontWeight: 'bold',
    },
    activeTab: {
      borderBottomWidth: 2,
      borderBottomColor: '#17156F',
    },
  });

export default TabBar;