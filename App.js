import 'react-native-gesture-handler';
import PushNotification from "react-native-push-notification";
import React from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  LogBox,
  
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import SignInScreen from './screens/SignInScreen'
import SignUpScreen from './screens/SignUpScreen'
import FirstScreen from './screens/FirstScreen'
import MainScreen from './screens/MainScreen'
import PostDetails from './screens/PostDetails'
import CreatePost from './screens/CreatePost'
import LoadingScreen from './screens/LoadingScreen'
import EditPost from './screens/EditPost'

//
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);
LogBox.ignoreLogs([
  'Setting a timer',
]);
LogBox.ignoreLogs([
  'Failed to get size for image',
]);
LogBox.ignoreLogs([
  "Can't perform a React state update on an unmounted component",
  "If you want to use Reanimated 2 then go through our installation"
]);


const RootStack = createStackNavigator();
const App = () => {
    
    return (
      <SafeAreaView style={{flex: 1}} >
        <StatusBar translucent backgroundColor='transparent' barStyle='dark-content' />
        <NavigationContainer>
            <RootStack.Navigator initialRouteName="LoadingScreen">
              <RootStack.Screen
                name="FirstScreen"
                component={FirstScreen}
                options={{ headerShown: false }}
              />
              <RootStack.Screen
                name="LoadingScreen"
                component={LoadingScreen}
                options={{ headerShown: false }}
              />
              <RootStack.Screen 
                name="SignInScreen"
                component={SignInScreen}
                options={{headerShown: false}}
                />
              <RootStack.Screen 
                name="SignUpScreen"
                component={SignUpScreen}
                options={{headerShown: false}}
                />
              <RootStack.Screen 
                name="MainScreen"
                component={MainScreen}
                options={{headerShown: false}}
                 />
              <RootStack.Screen 
                name="PostDetails"
                component={PostDetails}
                options={{headerShown: false}}
                />
              <RootStack.Screen 
                name="CreatePost"
                component={CreatePost}
                options={{headerShown: false}}
                />
              <RootStack.Screen 
                name="EditPost"
                component={EditPost}
                options={{headerShown: false}}
                />
          </RootStack.Navigator>
      </NavigationContainer>
      </SafeAreaView>
    );
};

const Demo = () => {
  return(
    <>
      <NavigationContainer>
        <MainScreen />
      </NavigationContainer>
    </>
  )
}

export default App;
//export default Demo;
