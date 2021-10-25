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
  Keyboard,
  Modal,
  ActivityIndicator,
  ToastAndroid
} from 'react-native';

import InputTextLayout from '../components/InputTextLayout'
import FBButton from '../components/FBButton'
import firebase from '../utilities/firebase_database'

const SignUpScreen = (props) => {
    const {navigation : {navigate}} = props;
    const [fullname, setFullname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [hide, setHide] = useState(false);
    const [err, setErr] = useState('');
    const [loading, setLoading] = useState(false);
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
    
    const signup = () => {
        if(!validate())
        {
            ToastAndroid.show(err, ToastAndroid.SHORT)
            return false;
        }
        setLoading(true);
        firebase.auth()
            .createUserWithEmailAndPassword(email, password)
            .then(() => saveUserToFirebase())
            .catch(error => {
                ToastAndroid.show(error.message, ToastAndroid.SHORT)
            })
    }

    const saveUserToFirebase = async () => {
        
        const { currentUser } = await firebase.auth();
        
        firebase.firestore().collection('users').doc(currentUser.uid).set({
            id: currentUser.uid,
            name: fullname,
            email: email,
            type: 'member',
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(() => console.log('Đã lưu vào firebase'))
        .then(() => navigate('MainScreen', { type: res.data().type, user: user }))
        .catch(error => console.log(error))
    }

    const validate = () =>{
        if(fullname.length == 0)
        {
            setErr('Tên không được rỗng');
            return false;
        }
        if(!validateEmail(email))
        {
            setErr('Email không hợp lệ');
            return false;
        }
        if(password.length < 6)
        {
            setErr('Mật khẩu phải ít nhất 6 ký tự');
            return false;
        }
        return true
    }

    const validateEmail = (email) => {
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
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
            <Header style={[styles.header, hide && styles.hideHeader]} navigate={navigate} hide={hide}/>
            <View style={styles.form}>
                <InputTextLayout 
                    placeholder="Fullname"
                    placeholderTextColor = 'grey'
                    secureTextEntry={false}
                    value = {fullname}
                    onChangeText={setFullname}
                    textContentType='name'
                    style={styles.inputText} />

                <InputTextLayout 
                    placeholder="Email"
                    placeholderTextColor = 'grey'
                    secureTextEntry={false}
                    value = {email}
                    keyboardType='email-address'
                    onChangeText={setEmail}
                    textContentType='emailAddress'
                    style={styles.inputText} />

                <InputTextLayout 
                    placeholder="Password"
                    placeholderTextColor = 'grey'
                    secureTextEntry={true}
                    value={password}
                    onChangeText={setPassword}
                    style={styles.inputText} />
                <TouchableOpacity onPress={signup}>
                    <Text style={styles.button}>Sign Up</Text>
                </TouchableOpacity>
                <View>
                    <Text style={styles.forgotPass}>
                        Already have an account?
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
            <Modal
                visible={loading}
                transparent={true}
                animationType='fade'
            >
                <View style={{flex: 1, backgroundColor:'rgba(52, 52, 52, 0.5)', justifyContent:'center', alignItems:'center'}}>
                    <Text style={{color: 'white', margin: 10, fontSize: 18}}>Đăng tạo tài khoản...</Text>
                    <ActivityIndicator size='large' color='white' />
                </View>
            </Modal>
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
            <Text style={[styles.headerText, hide && styles.hideHeaderText]}>Create </Text>
            <Text style={[styles.headerText, hide && styles.hideHeaderText]}>Account.</Text>
        </View>
    )
}

export default SignUpScreen;

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
    hideFooter: {
        maxHeight: 0,
        borderBottomLeftRadius: 0,
        padding: 0,
        margin: 0,
        overflow: 'hidden'
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