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
import firebase from '../utilities/firebase_database'
import { useState, useEffect } from 'react';

const LoadingScreen = (props) => {
    const { navigation: { navigate } } = props;

    const [isAuth, setIsAuth] = useState(false)
    useEffect(() => {
        firebase.auth()
            .onAuthStateChanged(user => {
                if (user) {
                    setIsAuth(true);
                    console.log(user.uid);
                    navigateToOtherScreen(user.uid)
                }
                else {
                    navigate('FirstScreen')
                }
            })

    },[])

    const navigateToOtherScreen = async (id) => {
        console.log('function, ' + id);
        await firebase.firestore().collection('users')
            .doc(id).get()
            .then(res => {
                navigate('MainScreen', { type: res.data().type })
            })
    }

    return (
        <>
            <StatusBar backgroundColor='transparent' />
            <View style={[styles.container, { backgroundColor: '#272F32', justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={{ color: 'white', textAlign: 'center', fontSize: 30, fontFamily: 'SVN-Harabaras' }}>The Blog</Text>
            </View>
        </>
    )
}

export default LoadingScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    wrap: {
        backgroundColor: 'rgba(52, 52, 52, 0.7)',
        flex: 1
    },

    header: {
        flex: 8,
    },
    logo: {
        flex: 1,
        justifyContent: 'flex-end',
        padding: 30
    },
    logoText: {
        fontSize: 16,
        color: 'silver',
        fontFamily: 'SVN-Harabaras'
    },
    main: {
        flex: 4,
        justifyContent: 'center',
        padding: 30
    },
    mainText: {
        fontFamily: 'SVN-Harabaras',
        fontSize: 26,
        color: 'white',
        fontWeight: 'bold',
    },

    buttonArea: {
        flex: 3,
        flexDirection: 'column',
        padding: 35,
        borderTopRightRadius: 35,
        backgroundColor: '#E5E1DE',
        justifyContent: 'space-around'
    },
    title: {
        fontSize: 17,
    },
    button: {
        backgroundColor: "#272F32",
        lineHeight: 50,
        borderRadius: 10,
        textAlign: 'center',
        color: '#E5E1DE',
        fontSize: 16
    },
    textSignup: {
        color: 'black',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center'
    }
})