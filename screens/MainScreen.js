import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/Ionicons';
import React, { useState, useEffect } from 'react';
import PushNotification from "react-native-push-notification";
import { useIsFocused } from '@react-navigation/native';
import {
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
} from 'react-native';
import firebase from '../utilities/firebase_database'
import HomeScreen from './HomeScreen'
import MyPosts from './MyPosts'
import MenuScreen from './MenuScreen'
import NotificationsScreen from './NotificationsScreen'
import ProfileScreen from './ProfileScreen'

const Tab = createMaterialTopTabNavigator();
//const Tab = createMaterialBottomTabNavigator();
const MainScreen = (props) => {
  const { route: { params } } = props;
  const [user, setUser] = useState(params.user);
  const isFocused = useIsFocused();

  useEffect(() => {
    const { currentUser } = firebase.auth()
    setUser(currentUser)
  
    
  }, [isFocused])
  console.log('main screen ,', user?.email);

  const pushNoti = (_title, _message) => {
    PushNotification.localNotificationSchedule({
      //... You can use all the options from localNotifications
      title: _title,
      message: _message, // (required)
      date: new Date(), // in 60 secs
      allowWhileIdle: false, // (optional) set notification to work while on doze, default: false
    });
    console.log('pushhhhhh')
  }
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        showIcon: true,
        activeTintColor: '#1878f3',
        inactiveTintColor: '#67686c',
        tabBarStyle: {
          height: 50
        },
        tabBarIconStyle: {
          width: 30,
          height: 30
        },
        indicatorStyle: {
          backgroundColor: '#1878f3'
        }
      }}
      backBehavior={false}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            focused ?
              (<Icon name="ios-home" color={color} size={30} />)
              :
              (<Icon name="home-outline" color={color} size={30} />)
          ),
        }}
      />
      {
        (params.type == 'admin') && (<Tab.Screen
          name="MyPosts"
          component={MyPosts}
          options={{
            tabBarIcon: ({ focused, color }) => (
              focused ?
                (<MaterialCommunityIcons name="post" color={color} size={30} />)
                :
                (<MaterialCommunityIcons name="post-outline" color={color} size={30} />)
            ),
          }}
        />)
      }
      <Tab.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            focused ?
              (<MaterialCommunityIcons name="account-box" color={color} size={30} />)
              :
              (<MaterialCommunityIcons name="account-box-outline" color={color} size={30} />)
          ),
        }}
      />
      <Tab.Screen
        name="Notification"
        component={NotificationsScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            focused ?
              (<Icon name="ios-notifications" color={color} size={30} />)
              :
              (<Icon name="notifications-outline" color={color} size={30} />)
          ),

        }}
      />
      <Tab.Screen
        name="MenuScreen"
        component={MenuScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            focused ?
              (<MaterialCommunityIcons name="notification-clear-all" color={color} size={30} />)
              :
              (<MaterialCommunityIcons name="menu" color={color} size={30} />)
          ),
        }}
      />
    </Tab.Navigator>
  )
}


export default MainScreen;