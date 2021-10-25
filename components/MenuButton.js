import React, {useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TextInput,
  Image,
  TouchableOpacity,
  Pressable
} from 'react-native';

const MenuButton = props =>{
    const {title, src, onPress} = props;
    return(
        <Pressable style={styles.contain} onPress={onPress}>
            <Image source={src} />
            <Text style={styles.title}>{title}</Text>
        </Pressable>
    )
}

export default MenuButton

const styles = StyleSheet.create({
    contain: {
        width: '48%',
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 10,
        marginTop: 10,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    },
    image: {
        width: 50,
        height: 50,
        resizeMode: 'cover'
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold'
    }
})