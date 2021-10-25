import React, {useEffect, useState} from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/AntDesign';
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
const windowW=Dimensions.get('window').width;
const ScaleImage = props => {
    const {uri} = props;
    const [scaleH, setScaleH] = useState(windowW)

    if(!uri) return(<View />)

    Image.getSize(uri, (width, height)=>{
        setScaleH(windowW/width * height);
    })

    return(
        <Image source={{uri: uri}} style={[styles.image,{height: scaleH}]} />
    )
}

export default ScaleImage;

const styles = StyleSheet.create({
    image: {
        width: '100%',
        height: windowW,
        marginBottom: 10,
        resizeMode: 'cover'
    }
})