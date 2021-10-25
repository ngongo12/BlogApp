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
    ActivityIndicator
} from 'react-native';

const IsLoading = () => {
    return(
        <View style={{flex: 1, justifyContent:'center', alignItems:'center'}}>
            <ActivityIndicator size='large' color='blue' />
        </View>
    )
}

export default IsLoading;