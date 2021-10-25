import React, { useState } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/AntDesign';
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
    Button,
    TouchableOpacity,
    ImageBackground,
    Dimensions,
    Modal,
    Pressable
} from 'react-native'

const ChooseImageMenu = props => {
    const {openLibrary, openCamera, close} = props;
    return (
        <View style={styles.container}>
            <View style={{flex: 1}} />
            <View style={styles.optionView}>
                <Pressable onPress={openLibrary}>
                    <Text style={styles.text}>Album</Text>
                </Pressable>
                <Pressable onPress={openCamera}>
                    <Text style={styles.text}>Camera</Text>
                </Pressable>
            </View>
            <Pressable style={styles.optionView} onPress={close}>
                <Text style={styles.text}>Close</Text>
            </Pressable>
        </View>
    )
}

export default ChooseImageMenu;

const styles = StyleSheet.create({
    container: {
        padding: 10,
        flex: 1
    },
    optionView: {
        borderRadius: 20,
        elevation: 10,
        backgroundColor: 'white',
        marginBottom: 10
    },
    text: {
        fontSize: 20,
        color: '#1878f3',
        textAlign: 'center',
        padding: 10
    }
})