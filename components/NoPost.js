import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    View,
    TextInput,
    Image,
    Text,
    TouchableOpacity,
    FlatList
} from 'react-native';

const NoPost = (props) =>{
    const {title} = props
    return(
        <View style={styles.container}>
            <Image source={require('../images/nopost.png')} style={styles.image}/>
            <Text style={styles.text}>{!title ? 'No Post To Show' : title}</Text>
        </View>
    )
}

export default NoPost;

const styles = StyleSheet.create({
    container:{
        backgroundColor: 'white',
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center'
    },
    image: {
        width: 150,
        height: 150,
        resizeMode: 'cover'
    },
    text:{
        fontSize: 30,
        color: '#ccc',
        fontWeight: 'bold',
        textAlign: 'center'
    }
})