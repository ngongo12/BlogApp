import React, { useState, useEffect } from 'react';
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
  KeyboardAvoidingView,
  Keyboard,
  ToastAndroid
} from 'react-native';
import firebase from '../utilities/firebase_database'
import InputTextLayout from '../components/InputTextLayout'
import FBButton from '../components/FBButton'
import Animated from 'react-native-reanimated';

const LoginScreen = (props) => {
    const {navigation : {navigate}} = props;
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [hide, setHide] = useState(false);
    useEffect(() => {
        Keyboard.addListener("keyboardDidShow", _keyboardDidShow);
        Keyboard.addListener("keyboardDidHide", _keyboardDidHide);
    
        // cleanup function
        return () => {
          Keyboard.removeListener("keyboardDidShow", _keyboardDidShow);
          Keyboard.removeListener("keyboardDidHide", _keyboardDidHide);
        };
    }, []);

    const _keyboardDidShow = () => setHide(true);
    const _keyboardDidHide = () => setHide(false);

    const signIn = () => {
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                //console.log(user);
                if(user)
                {
                    firebase.firestore().collection('users').doc(user.uid).get()
                    .then(res => {
                        navigate('MainScreen', { type: res.data().type, user: user })
                    })
                }
            })
            .catch((error) => {
                ToastAndroid.show(error.message, ToastAndroid.SHORT)
            });
    }
    
    return (
        <View
            style={[styles.container]}
            behavior='padding'
            >
            <StatusBar
                animated={true}
                backgroundColor="#E5E1DE"
                color = "#E5E1DE"
                translucent={true}
                barStyle="dark-content"
                hidden={false} />
            <Header style={[styles.header]} navigate={navigate} hide={hide}/>
            <View style={styles.form}>
                <InputTextLayout 
                    placeholder="Email"
                    placeholderTextColor = 'grey'
                    secureTextEntry={false}
                    value = {email}
                    keyboardType='email-address'
                    onChangeText={(email) => setEmail(email)}
                    style={styles.inputText} />

                <InputTextLayout 
                    placeholder="Password"
                    placeholderTextColor = 'grey'
                    secureTextEntry={true}
                    value={password}
                    onChangeText={(password) => setPassword(password)}
                    style={styles.inputText} />
                <TouchableOpacity onPress={()=> signIn()}>
                    <Text style={styles.button}>Sign In</Text>
                </TouchableOpacity>
                <View>
                    <Text style={styles.forgotPass}>
                        Forgot password?
                    </Text>
                </View>
                <View style={hide && styles.hideFooter}>
                    <Text style={styles.textOr}>-Or Sign up with-</Text>
                    <View style={[styles.fbGGButton]}>
                        <FBButton src = {require('../images/fb_logo.png')} />
                        <FBButton src = {require('../images/gg_logo.png')} />
                    </View>
                </View>
            </View> 
        </View>
    )
}

const Header = (props) => {
    const {style, hide, navigate} = props;
    return (
        <View style={[style, hide && styles.hideHeader]}>
            <View>
                <TouchableOpacity onPress={() => navigate('FirstScreen')}>
                    <Image 
                        style={[styles.backIcon, hide && styles.hideBackIcon]}
                        source={require('../images/ic_back.png')}
                        />
                </TouchableOpacity>
            </View>
            <Text style={[styles.headerText, hide && styles.hideHeaderText]}>Welcome </Text>
            <Text style={[styles.headerText, hide && styles.hideHeaderText]}>Back!</Text>
        </View>
    )
}

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#272F32',
    },

    hideHeader: {
        flex: 0,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderBottomLeftRadius: 0,
        margin: 0,
        paddingBottom: 16,
        paddingLeft: 16,
        padding: 16
    },

    header: {
        flex: 1,
        backgroundColor: '#E5E1DE',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        borderBottomLeftRadius: 50,
        paddingBottom: 50,
        paddingLeft: 30,
    },

    backIcon: {
        width: 30,
        height: 30,
        resizeMode: 'cover',
        marginBottom: 10,
    },

    hideBackIcon:{
        padding: 0,
        margin: 0,
        marginBottom: 0,
        marginRight: 10
    },

    headerText: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#343434',
        fontFamily: 'SVN-Harabaras',
    },
    hideHeaderText:{
        fontSize: 25,
    },

    form: {
        flex: 3,
        padding: 40,
        justifyContent: 'center',
        backgroundColor: '#272F32'
    },
    inputText:{
        color: 'white',
        marginBottom: 20,
    },
    hideFooter: {
        maxHeight: 0,
        borderBottomLeftRadius: 0,
        padding: 0,
        margin: 0,
        overflow: 'hidden'
    },
    button: {
        backgroundColor: '#E5E1DE',
        textAlign: 'center',
        borderRadius: 10,
        lineHeight: 50,
        fontSize: 16
    },
    forgotPass: {
        textAlign: 'right',
        color: '#E5E1DE',
        marginTop: 20,
        fontWeight: 'bold'
    },
    textOr: {
        marginTop: 30,
        color: '#E5E1DE',
        textAlign: 'center'
    },
    fbGGButton: {
        flexDirection: 'row',
        alignContent: 'space-around',
        alignItems: 'center',
        marginTop: 20,
        overflow: 'hidden'
    }
})