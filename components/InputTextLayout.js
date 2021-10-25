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
  TouchableOpacity
} from 'react-native';

const InputTextLayout = (props) => {
    const {placeholder, secureTextEntry, placeholderTextColor, onChangeText, value, textContentType ,keyboardType} = props;
    const [myPlaceholder, setMyPlaceholder] = useState(placeholder);
    var [hide, setHide] = useState(secureTextEntry);
    const [focused, setFocused] = useState(false);
    if(secureTextEntry)
        return(
            <View 
                style={[styles.container, props.style, focused && styles.focused]}
                onBlur={() => {setFocused(false); setMyPlaceholder(placeholder)}}
                onFocus={() => {setFocused(true); setMyPlaceholder('')}}>
                <Label label={placeholder} show ={focused || props.value.length != 0} focused={focused}/>
                <View style={styles.inputCover}>
                    <TextInput 
                        placeholder={myPlaceholder} 
                        placeholderTextColor = {placeholderTextColor}
                        onChangeText = {onChangeText}
                        style={styles.inputText} 
                        value = {value}
                        textContentType = {textContentType}
                        keyboardType={keyboardType}
                        secureTextEntry={hide}/>
                    <View style={styles.eye}>
                        <TouchableOpacity onPress={() => setHide(!hide) } style={styles.eye}>
                            <Image 
                                style={styles.eyeImage}
                                source={hide ? require('../images/ic_hide_pass.png') : require('../images/ic_show_pass.png')}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    else
        return(
            <View style={[styles.container, props.style, focused && styles.focused]}
                onBlur={() => {setFocused(false); setMyPlaceholder(placeholder)}}
                onFocus={() => {setFocused(true); setMyPlaceholder('')}}
            >
                <Label label={placeholder} show ={focused || props.value.length != 0} focused={focused}/>
                <View style={styles.inputCover}>
                    <TextInput 
                        placeholder={myPlaceholder}
                        onChangeText = {onChangeText}
                        style={styles.inputText}
                        placeholderTextColor = {placeholderTextColor}
                        textContentType = {textContentType}
                        keyboardType={keyboardType}
                        value={value}/>
                </View>
            </View>
        )
}

const Label = (props) => {
    if(props.show)
    {
        return (
            <Text style={[styles.label, props.focused && styles.labelFocus]}>{props.label}</Text>
        )
    }
    else
    {
        return (
            <>
            </>
        )
    }
}

export default InputTextLayout;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        justifyContent: 'center',
        borderBottomColor: 'grey',
        borderBottomWidth: 1,
        padding: 0,
        margin: 0
    },

    label: {
        fontSize: 10,
        color: 'gray',
        padding: 0,
        margin: 0,
        paddingLeft: 16,
    },

    labelFocus:{
        color: 'white'
    },

    inputCover: {

        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        flexWrap: 'wrap',
        padding: 0
    },

    focused: {
        borderBottomColor: 'white',
    },

    inputText: {
        flex: 1,
        color: 'white',
        paddingLeft: 16
    },

    eye: {
        width: 30,
        height: 30,
    },
    eyeImage: {
        flex: 1,
        width: 25,
        height: 25,
    },
    
})