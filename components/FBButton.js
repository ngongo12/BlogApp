import React, {useState} from 'react';
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
} from 'react-native';

const ImageButton = (props) => {
    const {src, onPress} = props;
    return (
      <TouchableOpacity style={styles.container} onPress={onPress}>
          <Image source={src} style={styles.image} />
      </TouchableOpacity>
    )
}

export default ImageButton;

const styles = StyleSheet.create({
    container: {
        width: 150,
        height: 60,
        backgroundColor: '#E5E1DE',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        flex: 1,
        margin: 10,
    },

    image: {
        width: 35,
        height: 35
    }
})