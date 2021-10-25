import React from 'react';

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
} from 'react-native';
import { useEffect, useState } from 'react';
import firebase from '../utilities/firebase_database'

const CommentItem = props => {
    const {item} = props
    const [user, setUser] = useState(null)
    
    useEffect(()=>{
        firebase.firestore().collection('users')
            .doc(item.createdBy)
            .get()
            .then((res)=>{
                setUser(res.data())
            })
            .catch((err)=>console.log(err))
    },[])

    return(
        <View style={styles.container}>
            <Image source={require('../images/avatar.jpg')} style={styles.avatar} />
            <View style={styles.content}>
                <Text style={styles.name}>{user?.name}</Text>
                <Text style={styles.text}>{item.content}</Text>
            </View>
        </View>
    )
}

export default CommentItem;

const styles = StyleSheet.create({
    container: {
        padding: 0,
        justifyContent: 'center',
        alignContent: 'center',
        flexDirection: 'column',
        flexDirection: 'row'
    },
    content: {
        flexDirection: 'column',
        flex: 1,
        borderRadius: 10,
        borderWidth: 0.5,
        borderColor: 'grey',
        backgroundColor:'#ccc',
        margin: 10,
        padding: 10,

    },
    avatar: {
        width: 50,
        height: 50,
        resizeMode: 'cover',
        borderRadius: 50,
        borderWidth: 0.5,
        borderColor: 'grey',
        margin: 10,
        marginRight: 0
    },
    name: {
        fontSize: 14,
        fontWeight: 'bold'
    },
    text: {
        fontSize: 13,
        textAlign: 'justify'
    }
})