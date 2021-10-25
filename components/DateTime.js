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

const DateTime = props =>{
    const {time} = props;
    if(!time) return (<Text>{(new Date()).toDateString()}</Text>)
    const createTime = new Date(time.toDate());
    const current = new Date();
    var showTime;
    var kq;
    showTime= current.getTime() - createTime.getTime();
    showTime=showTime/1000;
    //Chia thành phút
    showTime = showTime/60;
    if(showTime < 60)
    {
        kq = Math.floor(showTime) + 'm';
    }
    //Chia thành giờ
    else
    {
        showTime = showTime/60;
        if(showTime<24)
        {
            kq = Math.floor(showTime) + 'h';
        }
        //Chia thành ngày
        else
        {
            showTime = showTime/24;
            if(showTime < 10)
            {
                kq = Math.floor(showTime) + 'd';
            }
            else
            {
                kq = (new Date(time.toDate())).toDateString();
            }
        }
    }
    return(
        <Text style={styles.time}>{kq}</Text>
    )
}

export default DateTime;

const styles = StyleSheet.create({
    time: {
        fontSize: 13,
        fontWeight: "100",
        color: 'grey'
    },
})