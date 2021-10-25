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
import { useIsFocused } from '@react-navigation/native';
import firebase from '../utilities/firebase_database'
import MenuButton from '../components/MenuButton'

const MenuScreen = (props) => {
  const { navigation: { navigate } } = props;
  const isFocused = useIsFocused();
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false)
  const logOut = () => {
    firebase.auth().signOut()
      .then(() => {
        ToastAndroid.show('Logout' , ToastAndroid.SHORT)
        navigate('FirstScreen')
      })
  }
  useEffect(() => {
    const { currentUser } = firebase.auth()
    if(!currentUser)
    {}
    else
    firebase.firestore().collection('users')
            .doc(currentUser.uid)
            .get()
            .then(user=>{
                setUser(user.data());
                setIsAdmin(user.data()?.type=='admin')
            })
    
  }, [isFocused])
  return (
    <View style={styles.container}>
      <View style={styles.menuView}>
        <MenuButton title='Search' src={require('../images/search.png')} />
        {(isAdmin)&&<MenuButton title='Account Manager' src={require('../images/acc_manager.png')} />}
        <MenuButton title='Setting' src={require('../images/setting.png')} />
        <MenuButton title='Logout' src={require('../images/logout.png')} onPress={logOut} />
      </View>
    </View>
  )
}

export default MenuScreen

const styles = StyleSheet.create({
  container: {
    padding: 10
  },
  menuView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap'
  }
})