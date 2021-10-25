import React, {useState, useEffect} from 'react';
import PushNotification from "react-native-push-notification";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useIsFocused } from '@react-navigation/native';
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
    ActivityIndicator,
    FlatList,
    TouchableHighlight
} from 'react-native';
import firebase from '../utilities/firebase_database'
import DateTime from '../components/DateTime'

const Notifications = props => {
    const {navigate} = props
    const isFocused = useIsFocused();
    PushNotification.createChannel(
        {
          channelId: "12", // (required)
          channelName: "My channel", // (required)
          channelDescription: "A channel to categorise your notifications", // (optional) default: undefined.
          playSound: false, // (optional) default: true
          soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
          //importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
          vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
        },
        (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
      );
    const pushNoti = (_title, _message) =>{
        PushNotification.localNotificationSchedule({
            //... You can use all the options from localNotifications
            title: _title,
            message: _message, // (required)
            date: new Date(), // in 60 secs
            allowWhileIdle: false, // (optional) set notification to work while on doze, default: false
          });
        console.log('pushhhhhh')
    }

    //Lấy user
    const [user, setUser] = useState(null);
    const [arrNoti, setArrNoti] = useState([])
    useEffect(() => {
        const { currentUser } = firebase.auth()
        if(!currentUser)
        {

        }
        else
        {
            const uid = currentUser.uid;
            console.log('snapshot started', currentUser.uid)
            firebase.firestore().collection('notifications')
            .where('noread', 'array-contains', currentUser.uid)
            .limit(1)
            .onSnapshot(res=>{
                let temp = [];
                res.forEach(each=>{
                    const id = each.id
                    let arr = each.data().noread;
                    const obj = each.data();
                    console.log(obj)
                    let mess = !obj.message? "Message" : obj.message

                    pushNoti(obj.title, mess)

                    //Cập nhật trạng thái đã đọc
                    arr.splice(arr.indexOf(uid), 1)
                    firebase.firestore().collection('notifications')
                        .doc(id)
                        .update({
                            noread: arr,
                        })
                })
                //setArrNoti(temp)
            })
            firebase.firestore().collection('notifications')
            .where('sendTo', 'array-contains', currentUser.uid)
            .orderBy('createdAt', 'desc')
            .onSnapshot(res=>{
                let temp = [];
                res.forEach(each=>{
                    let obj = each.data();
                    temp.push({...obj, ...{key: each.id}})
                })
                setArrNoti(temp)
            })
        }
    }, [isFocused])
    
    return(
        <View>
            <FlatList
                data= {arrNoti}
                renderItem={({item}) =>
                    <ItemNotification item={item} navigate={navigate} user={user} />
                }
                keyExtractor = {item => item.key}  
                //onEndReached= {() => fetchMoreData()
             />
        </View>
    )
}

const ItemNotification = props => {
    const {item, navigate} = props
    return(
        <TouchableOpacity style={styles.container}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.content}>{item.message}</Text>
            <Text style={styles.time}>Thời gian: <DateTime time={item.createdAt} /></Text>
        </TouchableOpacity>
    )
}

export default Notifications;

const styles = StyleSheet.create({
    container:{
        padding: 10,
        backgroundColor: 'white',
        paddingLeft: 20,
        paddingRight: 20,
        borderBottomWidth: 0.5,
        borderColor: 'grey'
    },
    title:{
        fontSize: 14,
        fontWeight: 'bold'
    },
    content:{
        fontSize: 14,
    },
    time:{
        fontSize: 12,
        fontStyle: 'italic',
        color:'grey'
    }
})