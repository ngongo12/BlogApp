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
  Dimensions
} from 'react-native';
import ScaleImage from './ScaleImage'

const windowWidth = Dimensions.get('window').width;
const AddedImageView = props => {
    const {data, style, url} = props
    if(!data || data.length==0)
        if(!url)
            return(<View />)
        else
        {
            return(
                <View style={[styles.container, style]}>
                    {
                        <ScaleImage 
                            uri={url}
                        />
                    }
                </View>
            )
        }

    if(data.length==1)
        return(
            <View style={[styles.container, style]}>
                {
                    <Image 
                        style={[styles.imageOnly,
                            {height: windowWidth/ data[0].width* data[0].height}]} 
                        source={{uri: data[0].uri}}
                        key={data[0].fileName} 
                    />
                }
            </View>
        )
    if(data.length==2)
        return(
            <View style={styles.container}>
                {
                    data.map((item) => (
                        <Image style={styles.imageLarge} source={{uri: item.uri}} key={item.fileName} />
                    ))
                }
            </View>
        )
    if(data.length>=3)
        return(
            <View style={styles.container}>
                {
                    data.map(item => (
                        <Image style={styles.imageSmall} source={{uri: item.uri}} key={item.fileName} />
                    ))
                }
            </View>
        )
}

export default AddedImageView;

const styles = StyleSheet.create({
    container:{
        flexWrap: 'wrap',
        flexDirection: 'row',
    },
    imageOnly: {
        width: '100%',
        resizeMode: 'cover',
    },

    imageLarge: {
        width: '50%',
        height: windowWidth/2,
        resizeMode: 'cover'
    },
    imageSmall: {
        width: '33.33%',
        height: windowWidth/3,
        resizeMode: 'cover'
    }

})