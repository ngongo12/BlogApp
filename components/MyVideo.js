import React, {useEffect, useState} from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/AntDesign';
import Video from 'react-native-video';
import VideoPlayer from 'react-native-video-controls';
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
    Pressable,
    Modal
} from 'react-native';
const windowW = Dimensions.get('window').width;
const MyVideo = props =>{
    const {uri, url} = props
    console.log(url)
    if(!uri)
    {
        if(!url)
            return(<View />)
        else
        {
            return(
                <View style={styles.container}>
                    <VideoPlayer 
                        source={{uri: url}}
                        controls={true}
                        paused={true}
                        fullscreen={false}
                        resizeMode='cover'
                        style={styles.video}
                    />
                </View>
            )
        }
    }
    return(
        <View style={styles.container}>
            <VideoPlayer 
                source={{uri: uri}}
                controls={true}
                paused={true}
                fullscreen={false}
                resizeMode='cover'
                style={styles.video}
            />
        </View>
    )
}

export default MyVideo

const styles = StyleSheet.create({
    container:{
        backgroundColor: 'blue',
        flex: 1,
        width: windowW,
        height: windowW*3/4,
        marginBottom: 10
    },
    video:
    {
        flex: 1
    }
})